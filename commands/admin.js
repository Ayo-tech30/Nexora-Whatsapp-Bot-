// commands/admin.js
const { getGroupData, updateGroupData, addLog } = require('../utils/database');

module.exports = {
    add: async (sock, m, args, reply, groupMetadata, sender) => {
        if (!args[0]) return reply('❌ Usage: .add <phone number>\n\nExample: .add 1234567890');
        
        const number = args[0].replace(/[^0-9]/g, '');
        try {
            await sock.groupParticipantsUpdate(sender, [`${number}@s.whatsapp.net`], 'add');
            addLog('add', { groupId: sender, number, by: m.key.participant });
            reply(`✅ Successfully added +${number} to the group!`);
        } catch (error) {
            reply(`❌ Failed to add user. Make sure the number is correct and not already in the group.`);
        }
    },

    kick: async (sock, m, args, reply, groupMetadata, sender) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentioned || mentioned.length === 0) {
            return reply('❌ Usage: .kick @user\n\nTag the user you want to remove!');
        }
        
        try {
            await sock.groupParticipantsUpdate(sender, mentioned, 'remove');
            addLog('kick', { groupId: sender, users: mentioned, by: m.key.participant });
            reply(`✅ Successfully removed ${mentioned.length} user(s) from the group!`);
        } catch (error) {
            reply('❌ Failed to remove user(s). Make sure I have admin privileges!');
        }
    },

    lock: async (sock, m, args, reply, groupMetadata, sender) => {
        try {
            await sock.groupSettingUpdate(sender, 'announcement');
            updateGroupData(sender, { locked: true });
            addLog('lock', { groupId: sender, by: m.key.participant });
            reply('🔒 *Group Locked!*\n\nOnly admins can send messages now.');
        } catch (error) {
            reply('❌ Failed to lock group. Make sure I have admin privileges!');
        }
    },

    unlock: async (sock, m, args, reply, groupMetadata, sender) => {
        try {
            await sock.groupSettingUpdate(sender, 'not_announcement');
            updateGroupData(sender, { locked: false, panicmode: false });
            addLog('unlock', { groupId: sender, by: m.key.participant });
            reply('🔓 *Group Unlocked!*\n\nEveryone can send messages now.');
        } catch (error) {
            reply('❌ Failed to unlock group. Make sure I have admin privileges!');
        }
    },

    tagall: async (sock, m, args, reply, groupMetadata, sender) => {
        const message = args.join(' ') || 'Attention everyone!';
        const mentions = groupMetadata.participants.map(p => p.id);
        
        const text = `📢 *Group Announcement*\n\n${message}\n\n` + 
                     mentions.map((id, i) => `${i + 1}. @${id.split('@')[0]}`).join('\n');
        
        await sock.sendMessage(sender, { text, mentions });
    },

    hidetag: async (sock, m, args, reply, groupMetadata, sender) => {
        const message = args.join(' ') || 'Hidden tag message';
        const mentions = groupMetadata.participants.map(p => p.id);
        
        await sock.sendMessage(sender, { text: message, mentions });
    },

    setrules: async (sock, m, args, reply, groupMetadata, sender) => {
        const rules = args.join(' ');
        if (!rules) return reply('❌ Usage: .setrules <rules>\n\nExample: .setrules No spam, be respectful');
        
        updateGroupData(sender, { rules });
        addLog('setrules', { groupId: sender, rules, by: m.key.participant });
        reply(`✅ *Group Rules Updated!*\n\n📜 ${rules}`);
    },

    rules: async (sock, m, args, reply, groupMetadata, sender) => {
        const groupData = getGroupData(sender);
        
        if (!groupData.rules) {
            return reply('❌ No rules set for this group!\n\nAdmins can set rules with: .setrules <rules>');
        }
        
        reply(`📜 *Group Rules*\n\n${groupData.rules}`);
    },

    clear: async (sock, m, args, reply, groupMetadata, sender) => {
        const count = parseInt(args[0]) || 10;
        
        if (count > 100) return reply('❌ Cannot clear more than 100 messages at once!');
        
        reply(`🗑️ Message clear command received for ${count} messages.\n\n⚠️ Note: WhatsApp bots cannot delete messages sent by others. Only group admins can manually delete messages.`);
        addLog('clear', { groupId: sender, count, by: m.key.participant });
    },

    adminlist: async (sock, m, args, reply, groupMetadata, sender) => {
        const admins = groupMetadata.participants.filter(p => p.admin);
        
        if (admins.length === 0) {
            return reply('❌ No admins found in this group!');
        }
        
        const adminList = admins.map((admin, i) => {
            const rank = admin.admin === 'superadmin' ? '👑 Owner' : '⚔️ Admin';
            return `${i + 1}. ${rank} @${admin.id.split('@')[0]}`;
        }).join('\n');
        
        await sock.sendMessage(sender, {
            text: `⚔️ *Group Admins*\n\n${adminList}\n\n📊 Total: ${admins.length}`,
            mentions: admins.map(a => a.id)
        });
    },

    adminrank: async (sock, m, args, reply, groupMetadata, sender) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            return reply('❌ Usage: .adminrank @user\n\nTag a user to check their admin status!');
        }
        
        const participant = groupMetadata.participants.find(p => p.id === mentioned);
        
        if (!participant) {
            return reply('❌ User not found in this group!');
        }
        
        const rank = participant.admin === 'superadmin' ? '👑 Owner' :
                     participant.admin === 'admin' ? '⚔️ Admin' :
                     '👤 Member';
        
        reply(`📊 *Admin Rank*\n\n@${mentioned.split('@')[0]}\n\n${rank}`);
    },

    banlist: async (sock, m, args, reply, groupMetadata, sender) => {
        const { loadData } = require('../utils/database');
        const bans = loadData('bans');
        
        const bannedUsers = Object.keys(bans).filter(id => bans[id].banned);
        
        if (bannedUsers.length === 0) {
            return reply('✅ No banned users!');
        }
        
        const list = bannedUsers.map((id, i) => {
            const ban = bans[id];
            const type = ban.tempban ? '⏰ Temp' : '🔒 Permanent';
            return `${i + 1}. ${type} @${id.split('@')[0]}\n   Reason: ${ban.reason}`;
        }).join('\n\n');
        
        reply(`🚫 *Banned Users*\n\n${list}\n\n📊 Total: ${bannedUsers.length}`);
    },

    forceleave: async (sock, m, args, reply, groupMetadata, sender) => {
        try {
            await sock.groupLeave(sender);
            addLog('forceleave', { groupId: sender, by: m.key.participant });
        } catch (error) {
            reply('❌ Failed to leave the group!');
        }
    },

    audittrail: async (sock, m, args, reply, groupMetadata, sender) => {
        const { loadData } = require('../utils/database');
        const logs = loadData('logs');
        
        const groupLogs = Object.values(logs)
            .filter(log => log.groupId === sender)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 15);
        
        if (groupLogs.length === 0) {
            return reply('❌ No audit logs found for this group!');
        }
        
        const logList = groupLogs.map((log, i) => {
            const date = new Date(log.timestamp).toLocaleString();
            return `${i + 1}. [${log.type.toUpperCase()}] ${date}`;
        }).join('\n');
        
        reply(`📋 *Audit Trail (Last 15)*\n\n${logList}`);
    },

    modlog: async (sock, m, args, reply, groupMetadata, sender) => {
        const { loadData } = require('../utils/database');
        const logs = loadData('logs');
        
        const modLogs = Object.values(logs)
            .filter(log => log.groupId === sender && ['kick', 'ban', 'mute', 'warn', 'quarantine', 'paniclock'].includes(log.type))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 15);
        
        if (modLogs.length === 0) {
            return reply('❌ No moderation logs found!');
        }
        
        const logList = modLogs.map((log, i) => {
            const date = new Date(log.timestamp).toLocaleString();
            return `${i + 1}. [${log.type.toUpperCase()}] ${date}`;
        }).join('\n');
        
        reply(`🛡️ *Moderation Logs (Last 15)*\n\n${logList}`);
    },

    welcome: async (sock, m, args, reply, groupMetadata, sender) => {
        const status = args[0]?.toLowerCase();
        if (!['on', 'off'].includes(status)) {
            const current = getGroupData(sender).welcome;
            return reply(`👋 Welcome messages: ${current ? '✅ ON' : '❌ OFF'}\n\nUsage: .welcome on/off`);
        }
        
        updateGroupData(sender, { welcome: status === 'on' });
        reply(`${status === 'on' ? '✅' : '❌'} Welcome messages ${status === 'on' ? 'enabled' : 'disabled'}!`);
    },

    goodbye: async (sock, m, args, reply, groupMetadata, sender) => {
        const status = args[0]?.toLowerCase();
        if (!['on', 'off'].includes(status)) {
            const current = getGroupData(sender).goodbye;
            return reply(`👋 Goodbye messages: ${current ? '✅ ON' : '❌ OFF'}\n\nUsage: .goodbye on/off`);
        }
        
        updateGroupData(sender, { goodbye: status === 'on' });
        reply(`${status === 'on' ? '✅' : '❌'} Goodbye messages ${status === 'on' ? 'enabled' : 'disabled'}!`);
    }
};