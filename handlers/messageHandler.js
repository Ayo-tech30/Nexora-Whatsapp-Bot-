// handlers/messageHandler.js
const { loadData, saveData, getUserData, updateUserData } = require('../utils/database');
const aiCommands = require('../commands/ai');
const adminCommands = require('../commands/admin');
const creatorCommands = require('../commands/creator');
const moderationCommands = require('../commands/moderation');
const securityCommands = require('../commands/security');
const economyCommands = require('../commands/economy');
const funCommands = require('../commands/fun');
const statsCommands = require('../commands/stats');

const SUPPORT_LINK = 'https://chat.whatsapp.com/C58szhJGQ3EKlvFt1Hp57n';

const MENU = `╭━━ ✦彡 𝚴𝚵𝚾𝚯𝚪𝚫 彡✦ ━━╮     
║  ✧ Name: Kumoko
║  ✧ Prefix  : .   
║  ✧ Creator : Kynx
╰━━━━━━━━━━━━━━━━━━╯
 ❖ *.support* official group

╭━━ 🧠 AI & SMART TOOLS
┃ ✦ .ai
┃ ✦ .chat
┃ ✦ .smartreply on/off
┃ ✦ .aisummary
┃ ✦ .sentiment
┃ ✦ .mood
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ ⚔️ ADMIN CONTROL
┃ ✦ .add
┃ ✦ .kick
┃ ✦ .lock / .unlock
┃ ✦ .tagall / .hidetag
┃ ✦ .setrules
┃ ✦ .rules
┃ ✦ .clear <number>
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ 👑 CREATOR AUTHORITY (KYNX)
┃ ✦ .promote
┃ ✦ .demote
┃ ✦ .tempadmin <time>
┃ ✦ .ban / .tempban
┃ ✦ .unban
┃ ✦ .panic
┃ ✦ .disable <command>
┃ ✦ .enable <command>
┃ ✦ .restart
┃ ✦ .setprefix
┃ ✦ .mode public/private
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ ⚙️ CORE COMMANDS
┃ ✦ .adminlist
┃ ✦ .adminrank
┃ ✦ .banlist
┃ ✦ .forceleave
┃ ✦ .audittrail
┃ ✦ .modlog
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ 🛡️ MODERATION
┃ ✦ .mute / .unmute
┃ ✦ .warn
┃ ✦ .warnings
┃ ✦ .resetwarn
┃ ✦ .slowmode
┃ ✦ .note
┃ ✦ .report
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ 🛡️ SECURITY & ANTIRAID
┃ ✦ .antilink on/off
┃ ✦ .antispam on/off
┃ ✦ .antiflood
┃ ✦ .antibot
┃ ✦ .verify
┃ ✦ .shadowmute
┃ ✦ .raidmode
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ 💰 ECONOMY & LEVELS
┃ ✦ .balance / .bank
┃ ✦ .daily / .weekly
┃ ✦ .work / .crime
┃ ✦ .pay / .steal
┃ ✦ .level / .rank
┃ ✦ .leaderboard
┃ ✦ .shop
┃ ✦ .inventory
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ 🎮 FUN & SOCIAL
┃ ✦ .joke
┃ ✦ .quote
┃ ✦ .truth / .dare
┃ ✦ .ship
┃ ✦ .rizz
┃ ✦ .poll
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ 🎴 CARDS SYSTEM
┃ 🚧 This section is still under development
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ 📊 STATS & INFO
┃ ✦ .ping
┃ ✦ .stats
┃ ✦ .activity
┃ ✦ .permissions
┃ ✦ .creator
╰━━━━━━━━━━━━━━━━━━━━━━

✨ NEXORA - CREATED BY KYNX 👑 ✨ 
Type \`.help <section>\` to expand`;

async function messageHandler(sock, m, prefix, CREATOR) {
    try {
        const messageType = Object.keys(m.message)[0];
        const body = messageType === 'conversation' ? m.message.conversation :
                     messageType === 'extendedTextMessage' ? m.message.extendedTextMessage.text :
                     messageType === 'imageMessage' ? m.message.imageMessage.caption :
                     messageType === 'videoMessage' ? m.message.videoMessage.caption : '';

        if (!body) return;

        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const sender = m.key.remoteJid;
        const isGroup = sender.endsWith('@g.us');
        const senderNumber = m.key.participant || m.key.remoteJid;
        const isCreator = senderNumber === CREATOR;

        // Get group metadata if in group
        let groupMetadata, isAdmin = false, isBotAdmin = false;
        if (isGroup) {
            groupMetadata = await sock.groupMetadata(sender);
            const participant = groupMetadata.participants.find(p => p.id === senderNumber);
            isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin' || isCreator;
            const botParticipant = groupMetadata.participants.find(p => p.id === sock.user.id);
            isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
        }

        if (!isCmd) return;

        const reply = async (text) => {
            await sock.sendMessage(sender, { text }, { quoted: m });
        };

        // Menu command
        if (command === 'menu' || command === 'help') {
            return reply(MENU);
        }

        // Support command
        if (command === 'support') {
            return reply(`Join our official support group:\n${SUPPORT_LINK}`);
        }

        // AI Commands
        if (['ai', 'chat', 'smartreply', 'aisummary', 'sentiment', 'mood'].includes(command)) {
            return aiCommands[command](sock, m, args, reply);
        }

        // Admin Commands
        if (['add', 'kick', 'lock', 'unlock', 'tagall', 'hidetag', 'setrules', 'rules', 'clear'].includes(command)) {
            if (!isGroup) return reply('❌ This command can only be used in groups!');
            if (!isAdmin) return reply('❌ Only admins can use this command!');
            if (['add', 'kick', 'lock', 'unlock'].includes(command) && !isBotAdmin) {
                return reply('❌ I need to be an admin to execute this command!');
            }
            return adminCommands[command](sock, m, args, reply, groupMetadata, sender);
        }

        // Creator Commands
        if (['promote', 'demote', 'tempadmin', 'ban', 'tempban', 'unban', 'panic', 'disable', 'enable', 'restart', 'setprefix', 'mode'].includes(command)) {
            if (!isCreator) return reply('👑 This command is restricted to the bot creator (Kynx) only!');
            return creatorCommands[command](sock, m, args, reply, sender, isGroup, groupMetadata);
        }

        // Core Commands
        if (['adminlist', 'adminrank', 'banlist', 'forceleave', 'audittrail', 'modlog'].includes(command)) {
            if (!isGroup) return reply('❌ This command can only be used in groups!');
            if (!isAdmin) return reply('❌ Only admins can use this command!');
            return adminCommands[command](sock, m, args, reply, groupMetadata, sender);
        }

        // Moderation Commands
        if (['mute', 'unmute', 'warn', 'warnings', 'resetwarn', 'slowmode', 'note', 'report'].includes(command)) {
            if (!isGroup) return reply('❌ This command can only be used in groups!');
            if (!isAdmin && command !== 'report') return reply('❌ Only admins can use this command!');
            return moderationCommands[command](sock, m, args, reply, sender, senderNumber);
        }

        // Security Commands
        if (['antilink', 'antispam', 'antiflood', 'antibot', 'verify', 'shadowmute', 'raidmode'].includes(command)) {
            if (!isGroup) return reply('❌ This command can only be used in groups!');
            if (!isAdmin) return reply('❌ Only admins can use this command!');
            return securityCommands[command](sock, m, args, reply, sender);
        }

        // Economy Commands
        if (['balance', 'bank', 'daily', 'weekly', 'work', 'crime', 'pay', 'steal', 'level', 'rank', 'leaderboard', 'shop', 'inventory'].includes(command)) {
            return economyCommands[command](sock, m, args, reply, senderNumber, sender);
        }

        // Fun Commands
        if (['joke', 'quote', 'truth', 'dare', 'ship', 'rizz', 'poll'].includes(command)) {
            return funCommands[command](sock, m, args, reply, sender);
        }

        // Stats Commands
        if (['ping', 'stats', 'activity', 'permissions', 'creator'].includes(command)) {
            return statsCommands[command](sock, m, args, reply, isGroup, groupMetadata, senderNumber, CREATOR);
        }

    } catch (error) {
        console.error('Error handling message:', error);
        await sock.sendMessage(m.key.remoteJid, { text: '❌ An error occurred while processing your command.' }, { quoted: m });
    }
}

module.exports = messageHandler;
