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
const hierarchyCommands = require('../commands/hierarchy');
const imageCommands = require('../commands/image');
const { getUserPermission, PERMISSIONS } = require('../utils/hierarchy');

const SUPPORT_LINK = 'https://chat.whatsapp.com/C58szhJGQ3EKlvFt1Hp57n';
const MENU_IMAGE = 'https://i.pinimg.com/736x/fa/32/d7/fa32d7c8e3e84c93ec6e4b4dc8b90c87.jpg';

const MENU = `╭━━ ★ 𝚴𝚵𝚾𝚯𝚪𝚫 ★ ━━╮     
║  ✧ Name    : Kumoko
║  ✧ Prefix  : .   
║  ✧ Creator : Kynx
╰━━━━━━━━━━━━━━━━━━╯
 ❖ *.support* official group

╭━━ 👑 CREATOR OVERRIDE
┃ ✦ Full command access
┃ ✦ Role & permission override
┃ ✦ Immune to bans, mutes & limits
┃ ✦ Emergency system control
┃ ✦ .eval
┃ ✦ .exec
┃ ✦ .broadcast
┃ ✦ .globalmute on/off
┃ ✦ .resetbot
┃ ✦ .setprefix <prefix>
╰━━━━━━━━━━━━━━━━━━━━━

╭━━ 👑 ADMIN CONTROL
┃ ✦ .kick @user
┃ ✦ .warn @user
┃ ✦ .warnings @user
┃ ✦ .mute / .unmute
┃ ✦ .tempmute <time>
┃ ✦ .slowmode <time>
┃ ✦ .lock / .unlock
┃ ✦ .clear <amount>
┃ ✦ .tagall / .hidetag
┃ ✦ .raidmode on/off
┃ ✦ .antilink on/off
┃ ✦ .antispam on/off
┃ ✦ .antiflood on/off
┃ ✦ .welcome on/off
┃ ✦ .goodbye on/off
╰━━━━━━━━━━━━━━━━━━━━━

╭━━ 🛡️ MODS & GUARDIANS
┃ ✦ .ban @user
┃ ✦ .tempban @user <time>
┃ ✦ .unban @user
┃ ✦ .shadowmute @user
┃ ✦ .quarantine @user
┃ ✦ .verify on/off
┃ ✦ .antibot on/off
┃ ✦ .paniclock
┃ ✦ .lockdown
┃ ✦ .unlockdown
┃ ✦ .purgeghosts
┃ ✦ .selfpromote
┃ ✦ .selfdemote
╰━━━━━━━━━━━━━━━━━━━━━

╭━━ 🧰 COMMAND MANAGEMENT
┃ ✦ .disable <command>
┃ ✦ .enable <command>
┃ ✦ .disabledlist
┃ ✦ .cooldown <command> <time>
┃ ✦ .ratelimit <command>
┃ ✦ .alias <command> <alias>
┃ ✦ .usage <command>
┃ ✦ .logs
╰━━━━━━━━━━━━━━━━━━━━━

╭━━ 📸 IMAGE & STICKERS
┃ ✦ .image <query>
┃ ✦ .pinterest <query>
┃ ✦ .wallpaper <query>
┃ ✦ .animepic <name>
┃ ✦ .aesthetic <query>
┃ ✦ .meme
┃ ✦ .avatar
┃ ✦ .randompic
┃ ✦ .sticker / .s
┃ ✦ .take <name>, <author>
┃ ✦ .rename <name>, <author>
┃ ✦ .circle
┃ ✦ .crop
┃ ✦ .resize <px>
┃ ✦ .toimg
┃ ✦ .steal
╰━━━━━━━━━━━━━━━━━━━━━

╭━━ 💰 ECONOMY & LEVELS
┃ ✦ .balance / .bank
┃ ✦ .daily / .weekly / .monthly
┃ ✦ .work / .crime / .rob
┃ ✦ .pay / .steal
┃ ✦ .level / .rank
┃ ✦ .leaderboard
┃ ✦ .shop
┃ ✦ .inventory
┃ ✦ .use <item>
┃ ✦ .profile
┃ ✦ .reseteco
╰━━━━━━━━━━━━━━━━━━━━━

╭━━ 🎴 CARDS SYSTEM
┃ 🚧 This section is still under development
┃ Planned:
┃ ✦ T1 – T5 Cards
┃ ✦ Rarity & Elements
┃ ✦ Fusion System
┃ ✦ Trading & Market
┃ ✦ Limited Editions
╰━━━━━━━━━━━━━━━━━━━━━

╭━━ ⚔️ RPG SYSTEM
┃ 🚧 This section is still under development
┃ Planned:
┃ ✦ Character Creation
┃ ✦ Classes & Skills
┃ ✦ Quests & Dungeons
┃ ✦ PvE & PvP Battles
┃ ✦ Items, Gear & Bosses
┃ ✦ Guilds & Rankings
╰━━━━━━━━━━━━━━━━━━━━━

╭━━ 📊 INFO & SYSTEM
┃ ✦ .ping
┃ ✦ .uptime
┃ ✦ .stats
┃ ✦ .permissions
┃ ✦ .creator
┃ ✦ .support
┃ ✦ .changelog
┃ ✦ .bugreport
┃ ✦ .help
╰━━━━━━━━━━━━━━━━━━━━━`;

const ALL_COMMANDS = [
    'menu', 'help', 'support', 'mods', 'mod', 'staff', 'hierarchy',
    'eval', 'exec', 'broadcast', 'globalmute', 'resetbot', 'setprefix',
    'kick', 'warn', 'warnings', 'mute', 'unmute', 'tempmute', 'slowmode',
    'lock', 'unlock', 'clear', 'tagall', 'hidetag', 'raidmode', 'antilink',
    'antispam', 'antiflood', 'welcome', 'goodbye', 'ban', 'tempban', 'unban',
    'shadowmute', 'quarantine', 'verify', 'antibot', 'paniclock', 'lockdown',
    'unlockdown', 'purgeghosts', 'selfpromote', 'selfdemote', 'disable', 'enable',
    'disabledlist', 'cooldown', 'ratelimit', 'alias', 'usage', 'logs',
    'image', 'pinterest', 'wallpaper', 'animepic', 'aesthetic', 'meme', 'avatar',
    'randompic', 'sticker', 's', 'take', 'rename', 'circle', 'crop', 'resize',
    'toimg', 'steal', 'balance', 'bank', 'daily', 'weekly', 'monthly', 'work',
    'crime', 'rob', 'pay', 'level', 'rank', 'leaderboard', 'shop', 'inventory',
    'use', 'profile', 'reseteco', 'ping', 'uptime', 'stats', 'permissions',
    'creator', 'changelog', 'bugreport', 'add', 'setrules', 'rules', 'adminlist',
    'adminrank', 'banlist', 'forceleave', 'audittrail', 'modlog', 'resetwarn',
    'note', 'report', 'addmod', 'addguardian', 'removestaff', 'demotemod',
    'promoteguardian', 'myrank', 'ai', 'chat', 'smartreply', 'aisummary',
    'sentiment', 'mood', 'joke', 'quote', 'truth', 'dare', 'ship', 'rizz', 'poll',
    'activity', 'promote', 'demote', 'tempadmin', 'panic', 'restart', 'mode', 'retreat'
];

function findSimilarCommand(input) {
    const similar = ALL_COMMANDS.filter(cmd => {
        const distance = levenshteinDistance(input.toLowerCase(), cmd.toLowerCase());
        return distance <= 2;
    });
    return similar[0];
}

function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

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

        const userPermission = getUserPermission(senderNumber, CREATOR);
        const isModerator = userPermission >= PERMISSIONS.MODERATOR;
        const isGuardian = userPermission >= PERMISSIONS.GUARDIAN;

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

        if (command === 'menu' || command === 'help') {
            try {
                await sock.sendMessage(sender, {
                    image: { url: MENU_IMAGE },
                    caption: MENU
                }, { quoted: m });
            } catch (error) {
                return reply(MENU);
            }
            return;
        }

        if (command === 'support') {
            return reply(`📞 *Nexora Support Group*\n\nJoin our official support group for help, updates, and community:\n\n${SUPPORT_LINK}`);
        }

        if (['mods', 'mod', 'staff', 'hierarchy'].includes(command)) {
            return hierarchyCommands.mods(sock, m, args, reply, CREATOR);
        }

        if (command === 'addmod') return hierarchyCommands.addmod(sock, m, args, reply, senderNumber, CREATOR);
        if (command === 'addguardian') return hierarchyCommands.addguardian(sock, m, args, reply, senderNumber, CREATOR);
        if (command === 'removestaff') return hierarchyCommands.removestaff(sock, m, args, reply, senderNumber, CREATOR);
        if (command === 'demotemod') return hierarchyCommands.demotemod(sock, m, args, reply, senderNumber, CREATOR);
        if (command === 'promoteguardian') return hierarchyCommands.promoteguardian(sock, m, args, reply, senderNumber, CREATOR);
        if (command === 'myrank') return hierarchyCommands.myrank(sock, m, args, reply, senderNumber, CREATOR);
        if (command === 'selfpromote') return hierarchyCommands.selfpromote(sock, m, args, reply, senderNumber, CREATOR);
        if (command === 'selfdemote') return hierarchyCommands.selfdemote(sock, m, args, reply, senderNumber, CREATOR);

        if (['eval', 'exec', 'broadcast', 'globalmute', 'resetbot'].includes(command)) {
            if (!isCreator) return reply('👑 Only the creator (Kynx) can use this command!');
            return creatorCommands[command](sock, m, args, reply, sender, isGroup);
        }

        if (['disabledlist', 'cooldown', 'ratelimit', 'alias', 'usage', 'logs'].includes(command)) {
            if (!isCreator) return reply('👑 Only the creator can use this command!');
            return creatorCommands[command](sock, m, args, reply);
        }

        if (['ai', 'chat', 'smartreply', 'aisummary', 'sentiment', 'mood'].includes(command)) {
            return aiCommands[command](sock, m, args, reply);
        }

        if (['add', 'kick', 'lock', 'unlock', 'tagall', 'hidetag', 'setrules', 'rules', 'clear', 'welcome', 'goodbye'].includes(command)) {
            if (!isGroup) return reply('❌ This command only works in groups!');
            if (!isGuardian && !isAdmin) return reply('❌ Only guardians and above can use this!');
            if (['add', 'kick', 'lock', 'unlock'].includes(command) && !isBotAdmin) {
                return reply('❌ I need admin privileges!');
            }
            return adminCommands[command](sock, m, args, reply, groupMetadata, sender);
        }

        if (['ban', 'tempban', 'unban'].includes(command)) {
            if (!isModerator && !isCreator) return reply('⚔️ Only moderators and above!');
            return creatorCommands[command](sock, m, args, reply, sender);
        }

        if (['promote', 'demote', 'tempadmin', 'panic', 'disable', 'enable', 'restart', 'setprefix', 'mode'].includes(command)) {
            if (!isCreator) return reply('👑 Only the creator can use this!');
            return creatorCommands[command](sock, m, args, reply, sender, isGroup, groupMetadata);
        }

        if (['adminlist', 'adminrank', 'banlist', 'forceleave', 'audittrail', 'modlog', 'retreat'].includes(command)) {
            if (!isGroup) return reply('❌ This command only works in groups!');
            if (!isGuardian && !isAdmin) return reply('❌ Only guardians and above!');
            return adminCommands[command](sock, m, args, reply, groupMetadata, sender);
        }

        if (['mute', 'unmute', 'warn', 'warnings', 'resetwarn', 'slowmode', 'note', 'report', 'tempmute'].includes(command)) {
            if (!isGroup) return reply('❌ This command only works in groups!');
            if (!isGuardian && !isAdmin && command !== 'report') return reply('❌ Only guardians and above!');
            return moderationCommands[command](sock, m, args, reply, sender, senderNumber);
        }

        if (['quarantine', 'paniclock', 'lockdown', 'unlockdown', 'purgeghosts'].includes(command)) {
            if (!isGroup) return reply('❌ This command only works in groups!');
            if (!isModerator && !isAdmin) return reply('⚔️ Only moderators and above!');
            return moderationCommands[command](sock, m, args, reply, sender, senderNumber);
        }

        if (['antilink', 'antispam', 'antiflood', 'antibot', 'verify', 'shadowmute', 'raidmode'].includes(command)) {
            if (!isGroup) return reply('❌ This command only works in groups!');
            if (!isGuardian && !isAdmin) return reply('❌ Only guardians and above!');
            return securityCommands[command](sock, m, args, reply, sender);
        }

        if (['balance', 'bank', 'daily', 'weekly', 'monthly', 'work', 'crime', 'rob', 'pay', 'steal', 'level', 'rank', 'leaderboard', 'shop', 'inventory', 'use', 'profile', 'reseteco'].includes(command)) {
            return economyCommands[command](sock, m, args, reply, senderNumber, sender);
        }

        if (['joke', 'quote', 'truth', 'dare', 'ship', 'rizz', 'poll'].includes(command)) {
            return funCommands[command](sock, m, args, reply, sender);
        }

        if (['image', 'pinterest', 'wallpaper', 'animepic', 'aesthetic', 'meme', 'avatar', 'randompic', 'sticker', 's', 'take', 'rename', 'circle', 'crop', 'resize', 'toimg', 'steal'].includes(command)) {
            return imageCommands[command](sock, m, args, reply, sender);
        }

        if (['ping', 'uptime', 'stats', 'activity', 'permissions', 'creator', 'changelog', 'bugreport'].includes(command)) {
            return statsCommands[command](sock, m, args, reply, isGroup, groupMetadata, senderNumber, CREATOR);
        }

        const similarCmd = findSimilarCommand(command);
        if (similarCmd) {
            return reply(`❓ *Command Not Found*\n\nDid you mean: *.${similarCmd}*?\n\nType *.menu* to see all commands.`);
        } else {
            return reply(`❌ *Unknown Command*\n\nCommand *.${command}* doesn't exist.\n\nType *.menu* to see all available commands.`);
        }

    } catch (error) {
        console.error('Error handling message:', error);
        await sock.sendMessage(m.key.remoteJid, { text: '❌ An error occurred!' }, { quoted: m });
    }
}

module.exports = messageHandler;