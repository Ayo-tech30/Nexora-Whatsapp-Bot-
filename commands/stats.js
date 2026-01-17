// commands/stats.js
const os = require('os');

module.exports = {
    ping: async (sock, m, args, reply) => {
        const start = Date.now();
        await sock.sendMessage(m.key.remoteJid, { text: '🏓 Pinging...' }, { quoted: m });
        const latency = Date.now() - start;
        
        reply(`🏓 *Pong!*\n\n⚡ Response Time: ${latency}ms\n💚 Status: Online`);
    },

    stats: async (sock, m, args, reply) => {
        const { loadData } = require('../utils/database');
        const users = loadData('users');
        const groups = loadData('groups');
        const economy = loadData('economy');
        
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const stats = `📊 *Bot Statistics*

👥 Total Users: ${Object.keys(users).length}
👑 Total Groups: ${Object.keys(groups).length}
💰 Economy Users: ${Object.keys(economy).length}

⏱️ Uptime: ${hours}h ${minutes}m
💾 Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
🖥️ Platform: ${os.platform()}

✨ Nexora v1.0 - Created by Kynx`;
        
        reply(stats);
    },

    activity: async (sock, m, args, reply, isGroup, groupMetadata) => {
        if (!isGroup) return reply('❌ This command only works in groups!');
        
        const { loadData } = require('../utils/database');
        const logs = loadData('logs');
        
        const groupLogs = Object.values(logs)
            .filter(log => log.groupId === m.key.remoteJid)
            .length;
        
        const memberCount = groupMetadata.participants.length;
        const adminCount = groupMetadata.participants.filter(p => p.admin).length;
        
        const activity = `📈 *Group Activity*

👥 Members: ${memberCount}
⚔️ Admins: ${adminCount}
📋 Total Actions: ${groupLogs}

📊 Group is ${groupLogs > 100 ? 'Very Active' : groupLogs > 50 ? 'Active' : 'Growing'}`;
        
        reply(activity);
    },

    permissions: async (sock, m, args, reply, isGroup, groupMetadata, senderNumber) => {
        if (!isGroup) return reply('❌ This command only works in groups!');
        
        const participant = groupMetadata.participants.find(p => p.id === senderNumber);
        const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
        const isSuperAdmin = participant?.admin === 'superadmin';
        
        const perms = `🔐 *Your Permissions*

👤 User: @${senderNumber.split('@')[0]}

${isSuperAdmin ? '👑 Owner' : isAdmin ? '⚔️ Admin' : '👥 Member'}

Permissions:
${isAdmin ? '✅' : '❌'} Kick Members
${isAdmin ? '✅' : '❌'} Add Members
${isAdmin ? '✅' : '❌'} Promote/Demote
${isAdmin ? '✅' : '❌'} Change Settings
${isSuperAdmin ? '✅' : '❌'} Change Group Info`;
        
        reply(perms);
    },

    creator: async (sock, m, args, reply, isGroup, groupMetadata, senderNumber, CREATOR) => {
        const creatorInfo = `👑 *Bot Creator*

Name: Kynx
Number: ${CREATOR.split('@')[0]}

✨ Thank you for using Nexora!

💬 For support, use .support command`;
        
        reply(creatorInfo);
    }
};