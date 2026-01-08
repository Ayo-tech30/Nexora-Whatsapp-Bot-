// commands/moderation.js
const { getUserData, updateUserData, getGroupData, updateGroupData, addLog } = require('../utils/database');

module.exports = {
    mute: async (sock, m, args, reply, sender, senderNumber) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const duration = args[0];
        
        if (!mentioned) {
            return reply('❌ Usage: .mute <time> @user\n\nExample: .mute 10m @user');
        }
        
        const muteDuration = parseDuration(duration) || 600000; // Default 10 min
        
        updateUserData(mentioned, { muted: true, muteUntil: Date.now() + muteDuration });
        addLog('mute', { groupId: sender, user: mentioned, duration: muteDuration, by: senderNumber });
        
        reply(`🔇 *User Muted!*\n\n@${mentioned.split('@')[0]}\nDuration: ${duration || '10m'}`);
        
        setTimeout(() => {
            updateUserData(mentioned, { muted: false, muteUntil: null });
        }, muteDuration);
    },

    unmute: async (sock, m, args, reply, sender, senderNumber) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            return reply('❌ Usage: .unmute @user');
        }
        
        updateUserData(mentioned, { muted: false, muteUntil: null });
        addLog('unmute', { groupId: sender, user: mentioned, by: senderNumber });
        
        reply(`🔊 *User Unmuted!*\n\n@${mentioned.split('@')[0]} can now send messages.`);
    },

    warn: async (sock, m, args, reply, sender, senderNumber) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const reason = args.join(' ') || 'No reason provided';
        
        if (!mentioned) {
            return reply('❌ Usage: .warn @user <reason>\n\nExample: .warn @user Breaking rules');
        }
        
        const userData = getUserData(mentioned);
        const newWarnings = (userData.warnings || 0) + 1;
        
        updateUserData(mentioned, { warnings: newWarnings });
        addLog('warn', { groupId: sender, user: mentioned, reason, by: senderNumber });
        
        let message = `⚠️ *Warning Issued!*\n\n@${mentioned.split('@')[0]}\nWarnings: ${newWarnings}/3\nReason: ${reason}`;
        
        if (newWarnings >= 3) {
            message += '\n\n🚫 Maximum warnings reached! User will be kicked.';
            try {
                await sock.groupParticipantsUpdate(sender, [mentioned], 'remove');
                updateUserData(mentioned, { warnings: 0 });
            } catch (error) {
                message += '\n\n❌ Failed to kick user. Please do it manually.';
            }
        }
        
        reply(message);
    },

    warnings: async (sock, m, args, reply, sender, senderNumber) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || senderNumber;
        const userData = getUserData(mentioned);
        
        reply(`⚠️ *Warnings*\n\n@${mentioned.split('@')[0]}\n\nTotal: ${userData.warnings || 0}/3`);
    },

    resetwarn: async (sock, m, args, reply, sender, senderNumber) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            return reply('❌ Usage: .resetwarn @user');
        }
        
        updateUserData(mentioned, { warnings: 0 });
        addLog('resetwarn', { groupId: sender, user: mentioned, by: senderNumber });
        
        reply(`✅ *Warnings Reset!*\n\n@${mentioned.split('@')[0]} now has 0 warnings.`);
    },

    slowmode: async (sock, m, args, reply, sender, senderNumber) => {
        const duration = parseInt(args[0]) || 0;
        
        if (duration === 0) {
            updateGroupData(sender, { slowmode: 0 });
            return reply('✅ Slowmode disabled!');
        }
        
        if (duration < 5 || duration > 300) {
            return reply('❌ Slowmode duration must be between 5 and 300 seconds!');
        }
        
        updateGroupData(sender, { slowmode: duration });
        addLog('slowmode', { groupId: sender, duration, by: senderNumber });
        
        reply(`⏰ *Slowmode Enabled!*\n\nUsers must wait ${duration} seconds between messages.`);
    },

    note: async (sock, m, args, reply, sender, senderNumber) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const noteText = args.join(' ');
        
        if (!mentioned || !noteText) {
            return reply('❌ Usage: .note @user <note>\n\nExample: .note @user Check their messages regularly');
        }
        
        const userData = getUserData(mentioned);
        if (!userData.notes) userData.notes = [];
        
        userData.notes.push({
            text: noteText,
            by: senderNumber,
            timestamp: Date.now()
        });
        
        updateUserData(mentioned, userData);
        addLog('note', { groupId: sender, user: mentioned, note: noteText, by: senderNumber });
        
        reply(`📝 *Note Added!*\n\n@${mentioned.split('@')[0]}\n\n"${noteText}"`);
    },

    report: async (sock, m, args, reply, sender, senderNumber) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const reason = args.join(' ');
        
        if (!mentioned || !reason) {
            return reply('❌ Usage: .report @user <reason>\n\nExample: .report @user Spamming inappropriately');
        }
        
        addLog('report', { groupId: sender, reporter: senderNumber, reported: mentioned, reason });
        
        reply(`📢 *Report Submitted!*\n\nReported: @${mentioned.split('@')[0]}\nReason: ${reason}\n\n✅ Admins have been notified.`);
        
        // Notify admins (you can implement this)
        const groupData = await sock.groupMetadata(sender);
        const admins = groupData.participants.filter(p => p.admin).map(p => p.id);
        
        const adminMsg = `🚨 *New Report*\n\nReporter: @${senderNumber.split('@')[0]}\nReported: @${mentioned.split('@')[0]}\nReason: ${reason}`;
        
        await sock.sendMessage(sender, { text: adminMsg, mentions: [senderNumber, mentioned, ...admins] });
    }
};

function parseDuration(time) {
    if (!time) return null;
    const value = parseInt(time);
    const unit = time.slice(-1).toLowerCase();
    
    const multipliers = {
        's': 1000,
        'm': 60000,
        'h': 3600000,
        'd': 86400000
    };
    
    return multipliers[unit] ? value * multipliers[unit] : null;
                                                                    }
