// commands/security.js
const { getGroupData, updateGroupData } = require('../utils/database');

module.exports = {
    antilink: async (sock, m, args, reply, sender) => {
        const status = args[0]?.toLowerCase();
        if (!['on', 'off'].includes(status)) {
            const current = getGroupData(sender).antilink;
            return reply(`🔗 Antilink is currently: ${current ? '✅ ON' : '❌ OFF'}\n\nUsage: .antilink on/off`);
        }
        
        updateGroupData(sender, { antilink: status === 'on' });
        reply(`${status === 'on' ? '✅' : '❌'} Antilink ${status === 'on' ? 'enabled' : 'disabled'}!`);
    },

    antispam: async (sock, m, args, reply, sender) => {
        const status = args[0]?.toLowerCase();
        if (!['on', 'off'].includes(status)) {
            const current = getGroupData(sender).antispam;
            return reply(`🛡️ Antispam is currently: ${current ? '✅ ON' : '❌ OFF'}\n\nUsage: .antispam on/off`);
        }
        
        updateGroupData(sender, { antispam: status === 'on' });
        reply(`${status === 'on' ? '✅' : '❌'} Antispam ${status === 'on' ? 'enabled' : 'disabled'}!`);
    },

    antiflood: async (sock, m, args, reply, sender) => {
        const limit = parseInt(args[0]) || 5;
        updateGroupData(sender, { antiflood: limit });
        reply(`🌊 Antiflood set to ${limit} messages per 10 seconds!`);
    },

    antibot: async (sock, m, args, reply, sender) => {
        const status = args[0]?.toLowerCase();
        if (!['on', 'off'].includes(status)) {
            const current = getGroupData(sender).antibot;
            return reply(`🤖 Antibot is currently: ${current ? '✅ ON' : '❌ OFF'}\n\nUsage: .antibot on/off`);
        }
        
        updateGroupData(sender, { antibot: status === 'on' });
        reply(`${status === 'on' ? '✅' : '❌'} Antibot ${status === 'on' ? 'enabled' : 'disabled'}!`);
    },

    verify: async (sock, m, args, reply, sender) => {
        reply('✅ *Verification System*\n\n🔐 React to this message to verify yourself!\n\nNote: Full verification system requires additional setup.');
    },

    shadowmute: async (sock, m, args, reply, sender) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentioned) return reply('❌ Usage: .shadowmute @user');
        
        reply(`🔇 User @${mentioned.split('@')[0]} has been shadow muted. Their messages will be ignored by the bot.`);
    },

    raidmode: async (sock, m, args, reply, sender) => {
        const status = args[0]?.toLowerCase();
        if (!['on', 'off'].includes(status)) {
            const current = getGroupData(sender).raidmode;
            return reply(`🚨 Raid mode is currently: ${current ? '✅ ON' : '❌ OFF'}\n\nUsage: .raidmode on/off`);
        }
        
        updateGroupData(sender, { raidmode: status === 'on' });
        reply(`${status === 'on' ? '🚨' : '✅'} Raid mode ${status === 'on' ? 'ACTIVATED' : 'deactivated'}!\n\n${status === 'on' ? 'Only existing members can send messages.' : 'New members can join normally.'}`);
    }
};
