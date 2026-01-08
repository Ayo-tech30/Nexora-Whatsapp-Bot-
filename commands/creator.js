// commands/creator.js
const { banUser, unbanUser, loadData, saveData, addLog } = require('../utils/database');

module.exports = {
    promote: async (sock, m, args, reply, sender, isGroup, groupMetadata) => {
        if (!isGroup) return reply('❌ This command only works in groups!');
        
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return reply('❌ Usage: .promote @user');
        }
        
        try {
            await sock.groupParticipantsUpdate(sender, mentioned, 'promote');
            addLog('promote', { groupId: sender, users: mentioned });
            reply(`✅ Successfully promoted ${mentioned.length} user(s) to admin!`);
        } catch (error) {
            reply('❌ Failed to promote user(s)!');
        }
    },

    demote: async (sock, m, args, reply, sender, isGroup, groupMetadata) => {
        if (!isGroup) return reply('❌ This command only works in groups!');
        
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
            return reply('❌ Usage: .demote @user');
        }
        
        try {
            await sock.groupParticipantsUpdate(sender, mentioned, 'demote');
            addLog('demote', { groupId: sender, users: mentioned });
            reply(`✅ Successfully demoted ${mentioned.length} user(s) from admin!`);
        } catch (error) {
            reply('❌ Failed to demote user(s)!');
        }
    },

    tempadmin: async (sock, m, args, reply, sender, isGroup, groupMetadata) => {
        if (!isGroup) return reply('❌ This command only works in groups!');
        
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const time = args[0];
        
        if (!mentioned || !time) {
            return reply('❌ Usage: .tempadmin <time> @user\n\nExample: .tempadmin 1h @user');
        }
        
        const duration = parseDuration(time);
        if (!duration) return reply('❌ Invalid time format! Use: 1h, 30m, 1d');
        
        try {
            await sock.groupParticipantsUpdate(sender, [mentioned], 'promote');
            reply(`✅ @${mentioned.split('@')[0]} promoted to admin for ${time}!`);
            
            setTimeout(async () => {
                await sock.groupParticipantsUpdate(sender, [mentioned], 'demote');
                await sock.sendMessage(sender, { 
                    text: `⏰ Temporary admin period expired for @${mentioned.split('@')[0]}`,
                    mentions: [mentioned]
                });
            }, duration);
        } catch (error) {
            reply('❌ Failed to set temporary admin!');
        }
    },

    ban: async (sock, m, args, reply, sender) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const reason = args.slice(1).join(' ') || 'No reason provided';
        
        if (!mentioned) {
            return reply('❌ Usage: .ban @user <reason>\n\nExample: .ban @user Spamming');
        }
        
        banUser(mentioned, reason);
        reply(`🚫 *User Banned!*\n\n@${mentioned.split('@')[0]}\n\nReason: ${reason}`);
    },

    tempban: async (sock, m, args, reply, sender) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const time = args[0];
        const reason = args.slice(1).join(' ') || 'No reason provided';
        
        if (!mentioned || !time) {
            return reply('❌ Usage: .tempban <time> @user <reason>\n\nExample: .tempban 24h @user Spamming');
        }
        
        const duration = parseDuration(time);
        if (!duration) return reply('❌ Invalid time format! Use: 1h, 24h, 7d');
        
        banUser(mentioned, reason, true, duration);
        reply(`⏰ *User Temporarily Banned!*\n\n@${mentioned.split('@')[0]}\nDuration: ${time}\nReason: ${reason}`);
    },

    unban: async (sock, m, args, reply, sender) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            return reply('❌ Usage: .unban @user');
        }
        
        unbanUser(mentioned);
        reply(`✅ *User Unbanned!*\n\n@${mentioned.split('@')[0]} can now use the bot again.`);
    },

    panic: async (sock, m, args, reply, sender, isGroup) => {
        if (!isGroup) return reply('❌ This command only works in groups!');
        
        reply('🚨 *PANIC MODE ACTIVATED!*\n\n⚠️ Emergency shutdown initiated...');
        addLog('panic', { groupId: sender });
        
        setTimeout(async () => {
            try {
                await sock.groupLeave(sender);
            } catch (error) {
                console.error('Failed to leave group:', error);
            }
        }, 2000);
    },

    disable: async (sock, m, args, reply) => {
        const command = args[0];
        if (!command) return reply('❌ Usage: .disable <command>\n\nExample: .disable joke');
        
        const settings = loadData('settings');
        if (!settings.disabled) settings.disabled = [];
        
        if (settings.disabled.includes(command)) {
            return reply(`❌ Command "${command}" is already disabled!`);
        }
        
        settings.disabled.push(command);
        saveData('settings', settings);
        reply(`✅ Command "${command}" has been disabled!`);
    },

    enable: async (sock, m, args, reply) => {
        const command = args[0];
        if (!command) return reply('❌ Usage: .enable <command>\n\nExample: .enable joke');
        
        const settings = loadData('settings');
        if (!settings.disabled || !settings.disabled.includes(command)) {
            return reply(`❌ Command "${command}" is not disabled!`);
        }
        
        settings.disabled = settings.disabled.filter(c => c !== command);
        saveData('settings', settings);
        reply(`✅ Command "${command}" has been enabled!`);
    },

    restart: async (sock, m, args, reply) => {
        reply('🔄 Restarting bot...');
        addLog('restart', { timestamp: Date.now() });
        
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    },

    setprefix: async (sock, m, args, reply) => {
        const newPrefix = args[0];
        if (!newPrefix) return reply('❌ Usage: .setprefix <prefix>\n\nExample: .setprefix !');
        
        const settings = loadData('settings');
        settings.prefix = newPrefix;
        saveData('settings', settings);
        
        reply(`✅ Prefix changed to: ${newPrefix}\n\nExample: ${newPrefix}menu`);
    },

    mode: async (sock, m, args, reply) => {
        const mode = args[0]?.toLowerCase();
        
        if (!mode || !['public', 'private'].includes(mode)) {
            return reply('❌ Usage: .mode public/private');
        }
        
        const settings = loadData('settings');
        settings.mode = mode;
        saveData('settings', settings);
        
        reply(`✅ Bot mode set to: ${mode.toUpperCase()}\n\n${mode === 'private' ? '🔒 Only creator can use the bot' : '🌐 Everyone can use the bot'}`);
    }
};

function parseDuration(time) {
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
