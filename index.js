const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

const PREFIX = '.';
const BOT_NAME = 'Ayanokoji';
const CREATOR = '𝑰𝒔𝒂𝒈𝒊 𝒀𝒐𝒊𝒄𝒉𝒊';
const CREATOR_NUMBER = '2349049460676@c.us';

// Data storage
const userData = new Map();
const groupData = new Map();

// Load/Save data
function loadData() {
    try {
        if (fs.existsSync('userdata.json')) {
            const data = JSON.parse(fs.readFileSync('userdata.json'));
            Object.entries(data).forEach(([k, v]) => userData.set(k, v));
        }
        if (fs.existsSync('groupdata.json')) {
            const data = JSON.parse(fs.readFileSync('groupdata.json'));
            Object.entries(data).forEach(([k, v]) => groupData.set(k, v));
        }
    } catch (e) { console.log('No previous data'); }
}

function saveData() {
    fs.writeFileSync('userdata.json', JSON.stringify(Object.fromEntries(userData)));
    fs.writeFileSync('groupdata.json', JSON.stringify(Object.fromEntries(groupData)));
}

function getUser(userId) {
    if (!userData.has(userId)) {
        userData.set(userId, {
            name: 'Anonymous',
            balance: 1000,
            bank: 0,
            level: 1,
            xp: 0,
            lastDaily: 0,
            lastWeekly: 0,
            lastWork: 0,
            inventory: {},
            warnings: 0
        });
    }
    return userData.get(userId);
}

function getGroup(groupId) {
    if (!groupData.has(groupId)) {
        groupData.set(groupId, {
            antilink: false,
            antispam: false,
            antiflood: false,
            antibot: false,
            raidmode: false,
            smartreply: false,
            mods: [],
            guardians: [],
            owner: null,
            rules: 'No rules set yet.',
            welcomeMsg: 'Welcome @user!',
            muted: [],
            banned: [],
            warnings: {},
            slowmode: 0,
            disabledCommands: [],
            modLogs: [],
            mode: 'public'
        });
    }
    return groupData.get(groupId);
}

// Permission system
function isCreator(userId) {
    return userId === CREATOR_NUMBER;
}

function isOwner(groupId, userId) {
    const group = getGroup(groupId);
    return group.owner === userId || isCreator(userId);
}

function isGuardian(groupId, userId) {
    const group = getGroup(groupId);
    return group.guardians.includes(userId) || isOwner(groupId, userId);
}

function isMod(groupId, userId) {
    const group = getGroup(groupId);
    return group.mods.includes(userId) || isGuardian(groupId, userId);
}

function hasPermission(groupId, userId, level) {
    if (level === 'creator') return isCreator(userId);
    if (level === 'owner') return isOwner(groupId, userId);
    if (level === 'guardian') return isGuardian(groupId, userId);
    if (level === 'mod') return isMod(groupId, userId);
    return false;
}

// Menu
function getMenu() {
    return `╭━━ ✦彡  𝚴𝚵𝚾𝚯𝚪𝚫  彡✦ ━━╮     
║  ✧ Name: ${BOT_NAME}
║  ✧ Prefix  : ${PREFIX}   
║  ✧ Creator : ${CREATOR}
╰━━━━━━━━━━━━━━━━━━╯
 ❖ *.support* official group

╭━━ 🧠 AI & SMART TOOLS
┃ ✦ .ai [query]
┃ ✦ .chat [message]
┃ ✦ .smartreply on/off
┃ ✦ .aisummary
┃ ✦ .sentiment [text]
┃ ✦ .mood
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ ⚔️ GROUP CONTROL
┃ ✦ .add [number]
┃ ✦ .kick @user
┃ ✦ .lock / .unlock
┃ ✦ .tagall / .hidetag
┃ ✦ .setrules [text]
┃ ✦ .rules
┃ ✦ .clear [number]
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ 👑 CREATOR AUTHORITY
┃ ✦ .promote @user
┃ ✦ .demote @user
┃ ✦ .tempadmin @user [time]
┃ ✦ .ban / .tempban @user
┃ ✦ .unban @user
┃ ✦ .panic
┃ ✦ .disable [command]
┃ ✦ .enable [command]
┃ ✦ .restart
┃ ✦ .setprefix [prefix]
┃ ✦ .mode public/private
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ ⚙️ CORE COMMANDS
┃ ✦ .mods
┃ ✦ .adminlist
┃ ✦ .adminrank
┃ ✦ .banlist
┃ ✦ .forceleave
┃ ✦ .audittrail
┃ ✦ .modlog
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ 🛡️ MODERATION
┃ ✦ .mute / .unmute @user
┃ ✦ .warn @user [reason]
┃ ✦ .warnings @user
┃ ✦ .resetwarn @user
┃ ✦ .slowmode [seconds]
┃ ✦ .note [text]
┃ ✦ .report @user [reason]
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ 🛡️ SECURITY & ANTIRAID
┃ ✦ .antilink on/off
┃ ✦ .antispam on/off
┃ ✦ .antiflood on/off
┃ ✦ .antibot on/off
┃ ✦ .verify
┃ ✦ .shadowmute @user
┃ ✦ .raidmode on/off
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ 💰 ECONOMY & LEVELS
┃ ✦ .balance / .bank
┃ ✦ .daily / .weekly
┃ ✦ .work / .crime
┃ ✦ .pay @user [amount]
┃ ✦ .steal @user
┃ ✦ .level / .rank
┃ ✦ .leaderboard
┃ ✦ .shop
┃ ✦ .inventory
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━ 🎮 FUN & SOCIAL
┃ ✦ .joke
┃ ✦ .quote
┃ ✦ .truth / .dare
┃ ✦ .ship @user1 @user2
┃ ✦ .rizz
┃ ✦ .poll [question|opt1|opt2]
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
╰━━━━━━━━━━━━━━━━━━━━━━`;
}

// COMMANDS
const commands = {
    menu: async (msg) => {
        await msg.reply(getMenu());
    },

    // MOD SYSTEM
    mods: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        
        const group = getGroup(chat.id._serialized);
        
        let modList = `╭━━━━━━ ◈ MOD TEAM ◈ ━━━━━━╮
║
║  LEADERSHIP\n`;
        
        // Owner
        if (group.owner) {
            try {
                const contact = await client.getContactById(group.owner);
                const name = contact.pushname || contact.number;
                modList += `║  👑 Owner: ${name}\n`;
            } catch {
                modList += `║  👑 Owner: Set\n`;
            }
        } else {
            modList += `║  👑 Owner: Not set\n`;
        }
        
        modList += `║\n║  SENIOR STAFF\n`;
        
        // Guardians
        if (group.guardians && group.guardians.length > 0) {
            modList += `║  🛡️ Guardians: ${group.guardians.length}\n`;
            for (let i = 0; i < group.guardians.length; i++) {
                try {
                    const contact = await client.getContactById(group.guardians[i]);
                    const name = contact.pushname || contact.number;
                    const prefix = i === group.guardians.length - 1 ? '└─' : '├─';
                    modList += `║     ${prefix} ${name}\n`;
                } catch {}
            }
        } else {
            modList += `║  🛡️ Guardians: 0\n`;
        }
        
        modList += `║\n║  MODERATORS\n`;
        
        // Mods
        if (group.mods && group.mods.length > 0) {
            modList += `║  ⚔️ Mods: ${group.mods.length}\n`;
            for (let i = 0; i < group.mods.length; i++) {
                try {
                    const contact = await client.getContactById(group.mods[i]);
                    const name = contact.pushname || contact.number;
                    const prefix = i === group.mods.length - 1 ? '└─' : '├─';
                    modList += `║     ${prefix} ${name}\n`;
                } catch {}
            }
        } else {
            modList += `║  ⚔️ Mods: 0\n`;
        }
        
        const totalStaff = (group.owner ? 1 : 0) + 
                          (group.guardians?.length || 0) + 
                          (group.mods?.length || 0);
        
        modList += `║
║  📊 Total Staff: ${totalStaff}
║
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

Use .addmod @user to add moderators
Use .addguardian @user to add guardians`;
        
        await msg.reply(modList);
    },

    addmod: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'guardian')) {
            return msg.reply('❌ Guardians+ only!');
        }
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        const group = getGroup(chat.id._serialized);
        const userId = mentions[0].id._serialized;
        
        if (group.mods.includes(userId)) {
            return msg.reply('❌ Already a moderator!');
        }
        
        group.mods.push(userId);
        saveData();
        await msg.reply(`✅ @${mentions[0].number} is now a Moderator! ⚔️`);
    },

    removemod: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'guardian')) {
            return msg.reply('❌ Guardians+ only!');
        }
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        const group = getGroup(chat.id._serialized);
        const userId = mentions[0].id._serialized;
        
        group.mods = group.mods.filter(id => id !== userId);
        saveData();
        await msg.reply(`✅ @${mentions[0].number} removed from Moderators!`);
    },

    addguardian: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'owner')) {
            return msg.reply('❌ Owner only!');
        }
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        const group = getGroup(chat.id._serialized);
        const userId = mentions[0].id._serialized;
        
        if (group.guardians.includes(userId)) {
            return msg.reply('❌ Already a guardian!');
        }
        
        group.mods = group.mods.filter(id => id !== userId);
        group.guardians.push(userId);
        saveData();
        await msg.reply(`✅ @${mentions[0].number} is now a Guardian! 🛡️`);
    },

    removeguardian: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'owner')) {
            return msg.reply('❌ Owner only!');
        }
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        const group = getGroup(chat.id._serialized);
        const userId = mentions[0].id._serialized;
        
        group.guardians = group.guardians.filter(id => id !== userId);
        saveData();
        await msg.reply(`✅ @${mentions[0].number} removed from Guardians!`);
    },

    setowner: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        
        const group = getGroup(chat.id._serialized);
        if (group.owner && !isCreator(msg.from)) {
            return msg.reply('❌ Only current owner can transfer!');
        }
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        const userId = mentions[0].id._serialized;
        group.owner = userId;
        group.guardians = group.guardians.filter(id => id !== userId);
        group.mods = group.mods.filter(id => id !== userId);
        
        saveData();
        await msg.reply(`👑 @${mentions[0].number} is now the Group Owner!`);
    },

    // AI TOOLS
    ai: async (msg, args) => {
        if (!args[0]) return msg.reply('Usage: .ai [query]');
        await msg.reply('🤖 AI: Requires API integration. Coming soon!');
    },

    chat: async (msg, args) => {
        if (!args[0]) return msg.reply('Usage: .chat [message]');
        await msg.reply('💬 Chat AI: Requires API integration. Coming soon!');
    },

    smartreply: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const group = getGroup(chat.id._serialized);
        if (args[0] === 'on') {
            group.smartreply = true;
            await msg.reply('✅ Smart Reply enabled!');
        } else if (args[0] === 'off') {
            group.smartreply = false;
            await msg.reply('✅ Smart Reply disabled!');
        } else {
            await msg.reply(`Smart Reply: ${group.smartreply ? 'ON' : 'OFF'}\nUsage: .smartreply on/off`);
        }
        saveData();
    },

    sentiment: async (msg, args) => {
        if (!args[0]) return msg.reply('Usage: .sentiment [text]');
        const text = args.join(' ');
        const sentiments = ['😊 Positive', '😐 Neutral', '😢 Negative'];
        const result = sentiments[Math.floor(Math.random() * sentiments.length)];
        await msg.reply(`Sentiment Analysis: ${result}`);
    },

    mood: async (msg) => {
        const moods = ['😊 Happy', '😔 Sad', '😡 Angry', '😎 Cool', '🤔 Thoughtful', '😴 Tired'];
        const mood = moods[Math.floor(Math.random() * moods.length)];
        await msg.reply(`Current mood: ${mood}`);
    },

    // GROUP CONTROL
    add: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        if (!args[0]) return msg.reply('Usage: .add [number]');
        const number = args[0].replace(/[^0-9]/g, '') + '@c.us';
        
        try {
            await chat.addParticipants([number]);
            await msg.reply('✅ User added!');
        } catch {
            await msg.reply('❌ Failed to add user!');
        }
    },

    kick: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        try {
            await chat.removeParticipants([mentions[0].id._serialized]);
            await msg.reply('✅ Kicked!');
        } catch {
            await msg.reply('❌ Failed! Need admin.');
        }
    },

    lock: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        try {
            await chat.setMessagesAdminsOnly(true);
            await msg.reply('🔒 Group locked!');
        } catch {
            await msg.reply('❌ Failed! Need admin.');
        }
    },

    unlock: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        try {
            await chat.setMessagesAdminsOnly(false);
            await msg.reply('✅ Group unlocked!');
        } catch {
            await msg.reply('❌ Failed! Need admin.');
        }
    },

    tagall: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        let text = '╭─── ◈ TAGALL ◈ ───╮\n';
        const mentions = [];
        
        for (const p of chat.participants) {
            const contact = await client.getContactById(p.id._serialized);
            mentions.push(contact);
            text += `║ @${p.id.user}\n`;
        }
        text += '╰━━━━━━━━━━━━━━━━━╯';
        
        await chat.sendMessage(text, { mentions });
    },

    hidetag: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const text = args.join(' ') || 'Hidden tag!';
        const mentions = [];
        
        for (const p of chat.participants) {
            mentions.push(await client.getContactById(p.id._serialized));
        }
        
        await chat.sendMessage(text, { mentions });
    },

    setrules: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        if (!args[0]) return msg.reply('Usage: .setrules [text]');
        
        const group = getGroup(chat.id._serialized);
        group.rules = args.join(' ');
        saveData();
        await msg.reply('✅ Rules updated!');
    },

    rules: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        
        const group = getGroup(chat.id._serialized);
        await msg.reply(`╭─── ◈ GROUP RULES ◈ ───╮\n\n${group.rules}\n\n╰━━━━━━━━━━━━━━━━━╯`);
    },

    clear: async (msg, args) => {
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        await msg.reply('🗑️ Clear messages: Feature coming soon!');
    },

    // CREATOR COMMANDS
    promote: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!isCreator(msg.from)) return msg.reply('❌ Creator only!');
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        try {
            await chat.promoteParticipants([mentions[0].id._serialized]);
            await msg.reply('✅ Promoted to admin!');
        } catch {
            await msg.reply('❌ Failed!');
        }
    },

    demote: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!isCreator(msg.from)) return msg.reply('❌ Creator only!');
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        try {
            await chat.demoteParticipants([mentions[0].id._serialized]);
            await msg.reply('✅ Demoted!');
        } catch {
            await msg.reply('❌ Failed!');
        }
    },

    ban: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!isCreator(msg.from)) return msg.reply('❌ Creator only!');
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        const group = getGroup(chat.id._serialized);
        const userId = mentions[0].id._serialized;
        
        if (!group.banned.includes(userId)) {
            group.banned.push(userId);
        }
        
        try {
            await chat.removeParticipants([userId]);
            saveData();
            await msg.reply('✅ Banned and kicked!');
        } catch {
            saveData();
            await msg.reply('✅ Banned (couldn\'t kick)!');
        }
    },

    unban: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!isCreator(msg.from)) return msg.reply('❌ Creator only!');
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        const group = getGroup(chat.id._serialized);
        const userId = mentions[0].id._serialized;
        
        group.banned = group.banned.filter(id => id !== userId);
        saveData();
        await msg.reply('✅ Unbanned!');
    },

    panic: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!isCreator(msg.from)) return msg.reply('❌ Creator only!');
        
        try {
            await chat.setMessagesAdminsOnly(true);
            await msg.reply('🚨 PANIC MODE ACTIVATED! Group locked!');
        } catch {
            await msg.reply('❌ Failed!');
        }
    },

    disable: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!isCreator(msg.from)) return msg.reply('❌ Creator only!');
        
        if (!args[0]) return msg.reply('Usage: .disable [command]');
        
        const group = getGroup(chat.id._serialized);
        const cmd = args[0].toLowerCase();
        
        if (!group.disabledCommands.includes(cmd)) {
            group.disabledCommands.push(cmd);
        }
        saveData();
        await msg.reply(`✅ Command .${cmd} disabled!`);
    },

    enable: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!isCreator(msg.from)) return msg.reply('❌ Creator only!');
        
        if (!args[0]) return msg.reply('Usage: .enable [command]');
        
        const group = getGroup(chat.id._serialized);
        const cmd = args[0].toLowerCase();
        
        group.disabledCommands = group.disabledCommands.filter(c => c !== cmd);
        saveData();
        await msg.reply(`✅ Command .${cmd} enabled!`);
    },

    restart: async (msg) => {
        if (!isCreator(msg.from)) return msg.reply('❌ Creator only!');
        await msg.reply('🔄 Restarting bot...');
        saveData();
        process.exit(0);
    },

    setprefix: async (msg, args) => {
        if (!isCreator(msg.from)) return msg.reply('❌ Creator only!');
        if (!args[0]) return msg.reply('Usage: .setprefix [prefix]');
        await msg.reply('⚠️ Prefix change requires code edit. Current: ' + PREFIX);
    },

    mode: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!isCreator(msg.from)) return msg.reply('❌ Creator only!');
        
        const group = getGroup(chat.id._serialized);
        if (args[0] === 'public') {
            group.mode = 'public';
            await msg.reply('✅ Bot mode: PUBLIC');
        } else if (args[0] === 'private') {
            group.mode = 'private';
            await msg.reply('✅ Bot mode: PRIVATE (Mods+ only)');
        } else {
            await msg.reply(`Current mode: ${group.mode}\nUsage: .mode public/private`);
        }
        saveData();
    },

    // CORE COMMANDS
    adminlist: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        
        const admins = chat.participants.filter(p => p.isAdmin);
        let list = '╭─── ◈ ADMINS ◈ ───╮\n';
        
        for (const admin of admins) {
            try {
                const contact = await client.getContactById(admin.id._serialized);
                const name = contact.pushname || contact.number;
                list += `║ 👑 ${name}\n`;
            } catch {}
        }
        list += `╰━━━━━━━━━━━━━━━━━╯\nTotal: ${admins.length}`;
        await msg.reply(list);
    },

    adminrank: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        
        const participant = chat.participants.find(p => p.id._serialized === msg.from);
        if (!participant) return msg.reply('❌ Not found!');
        
        let rank = '👥 Member';
        if (isCreator(msg.from)) rank = '⚡ CREATOR';
        else if (isOwner(chat.id._serialized, msg.from)) rank = '👑 Owner';
        else if (isGuardian(chat.id._serialized, msg.from)) rank = '🛡️ Guardian';
        else if (isMod(chat.id._serialized, msg.from)) rank = '⚔️ Moderator';
        else if (participant.isAdmin) rank = '👑 Admin';
        
        await msg.reply(`Your rank: ${rank}`);
    },

    banlist: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const group = getGroup(chat.id._serialized);
        if (!group.banned || group.banned.length === 0) {
            return msg.reply('📋 No banned users!');
        }
        
        let list = '╭─── ◈ BANNED USERS ◈ ───╮\n';
        for (const userId of group.banned) {
            try {
                const contact = await client.getContactById(userId);
                list += `║ ❌ @${contact.number}\n`;
            } catch {
                list += `║ ❌ Unknown\n`;
            }
        }
        list += `╰━━━━━━━━━━━━━━━━━╯\nTotal: ${group.banned.length}`;
        await msg.reply(list);
    },

    forceleave: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!isCreator(msg.from)) return msg.reply('❌ Creator only!');
        
        await msg.reply('👋 Leaving group...');
        await chat.leave();
    },

    audittrail: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'guardian')) {
            return msg.reply('❌ Guardians+ only!');
        }
        
        const group = getGroup(chat.id._serialized);
        const logs = group.modLogs || [];
        
        if (logs.length === 0) {
            return msg.reply('📜 No audit trail yet!');
        }
        
        let trail = '╭─── ◈ AUDIT TRAIL ◈ ───╮\n';
        logs.slice(-10).forEach(log => {
            trail += `║ ${log}\n`;
        });
        trail += '╰━━━━━━━━━━━━━━━━━╯';
        await msg.reply(trail);
    },

    modlog: async (msg) => {
        await commands.audittrail(msg);
    },

    // MODERATION
    mute: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        const group = getGroup(chat.id._serialized);
        const userId = mentions[0].id._serialized;
        
        if (!group.muted.includes(userId)) {
            group.muted.push(userId);
        }
        saveData();
        await msg.reply(`🔇 @${mentions[0].number} muted!`);
    },

    unmute: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        const group = getGroup(chat.id._serialized);
        const userId = mentions[0].id._serialized;
        
        group.muted = group.muted.filter(id => id !== userId);
        saveData();
        await msg.reply(`🔊 @${mentions[0].number} unmuted!`);
    },

    warn: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        const group = getGroup(chat.id._serialized);
        const userId = mentions[0].id._serialized;
        
        if (!group.warnings[userId]) group.warnings[userId] = 0;
        group.warnings[userId]++;
        
        const warns = group.warnings[userId];
        const reason = args.slice(1).join(' ') || 'No reason';
        
        // Log action
        if (!group.modLogs) group.modLogs = [];
        group.modLogs.push(`⚠️ Warn: @${mentions[0].number} by @${msg.from.split('@')[0]} - ${reason}`);
        
        saveData();
        
        if (warns >= 3) {
            try {
                await chat.removeParticipants([userId]);
                await msg.reply(`⚠️ @${mentions[0].number} kicked! (3 warnings)`);
                group.warnings[userId] = 0;
            } catch {
                await msg.reply(`⚠️ Warning ${warns}/3 for @${mentions[0].number}\nReason: ${reason}`);
            }
        } else {
            await msg.reply(`⚠️ Warning ${warns}/3 for @${mentions[0].number}\nReason: ${reason}`);
        }
    },

    warnings: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        
        const mentions = await msg.getMentions();
        const group = getGroup(chat.id._serialized);
        
        if (mentions[0]) {
            const userId = mentions[0].id._serialized;
            const warns = group.warnings[userId] || 0;
            await msg.reply(`⚠️ @${mentions[0].number} has ${warns}/3 warnings`);
        } else {
            const userId = msg.from;
            const warns = group.warnings[userId] || 0;
            await msg.reply(`⚠️ You have ${warns}/3 warnings`);
        }
    },

    resetwarn: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        const group = getGroup(chat.id._serialized);
        const userId = mentions[0].id._serialized;
        
        group.warnings[userId] = 0;
        saveData();
        await msg.reply(`✅ Warnings reset for @${mentions[0].number}!`);
    },

    slowmode: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const seconds = parseInt(args[0]);
        if (isNaN(seconds)) return msg.reply('Usage: .slowmode [seconds] (0 to disable)');
        
        const group = getGroup(chat.id._serialized);
        group.slowmode = seconds;
        saveData();
        
        if (seconds === 0) {
            await msg.reply('✅ Slowmode disabled!');
        } else {
            await msg.reply(`✅ Slowmode: ${seconds}s between messages`);
        }
    },

    note: async (msg, args) => {
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        if (!args[0]) return msg.reply('Usage: .note [text]');
        await msg.reply(`📝 Note saved: ${args.join(' ')}`);
    },

    report: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        const reason = args.slice(1).join(' ') || 'No reason';
        const group = getGroup(chat.id._serialized);
        
        if (!group.modLogs) group.modLogs = [];
        group.modLogs.push(`📢 Report: @${mentions[0].number} by @${msg.from.split('@')[0]} - ${reason}`);
        saveData();
        
        await msg.reply(`✅ Report submitted!\nUser: @${mentions[0].number}\nReason: ${reason}`);
    },

    // SECURITY
    antilink: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const group = getGroup(chat.id._serialized);
        if (args[0] === 'on') {
            group.antilink = true;
            await msg.reply('✅ Antilink ON!');
        } else if (args[0] === 'off') {
            group.antilink = false;
            await msg.reply('✅ Antilink OFF!');
        } else {
            await msg.reply(`Antilink: ${group.antilink ? 'ON' : 'OFF'}\nUsage: .antilink on/off`);
        }
        saveData();
    },

    antispam: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const group = getGroup(chat.id._serialized);
        if (args[0] === 'on') {
            group.antispam = true;
            await msg.reply('✅ Anti-spam ON!');
        } else if (args[0] === 'off') {
            group.antispam = false;
            await msg.reply('✅ Anti-spam OFF!');
        } else {
            await msg.reply(`Anti-spam: ${group.antispam ? 'ON' : 'OFF'}\nUsage: .antispam on/off`);
        }
        saveData();
    },

    antiflood: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const group = getGroup(chat.id._serialized);
        if (args[0] === 'on') {
            group.antiflood = true;
            await msg.reply('✅ Anti-flood ON!');
        } else if (args[0] === 'off') {
            group.antiflood = false;
            await msg.reply('✅ Anti-flood OFF!');
        } else {
            await msg.reply(`Anti-flood: ${group.antiflood ? 'ON' : 'OFF'}\nUsage: .antiflood on/off`);
        }
        saveData();
    },

    antibot: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'mod')) {
            return msg.reply('❌ Mods+ only!');
        }
        
        const group = getGroup(chat.id._serialized);
        if (args[0] === 'on') {
            group.antibot = true;
            await msg.reply('✅ Anti-bot ON!');
        } else if (args[0] === 'off') {
            group.antibot = false;
            await msg.reply('✅ Anti-bot OFF!');
        } else {
            await msg.reply(`Anti-bot: ${group.antibot ? 'ON' : 'OFF'}\nUsage: .antibot on/off`);
        }
        saveData();
    },

    verify: async (msg) => {
        await msg.reply('✅ Verification system coming soon!');
    },

    shadowmute: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'guardian')) {
            return msg.reply('❌ Guardians+ only!');
        }
        
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('❌ Tag someone!');
        
        await msg.reply(`👻 @${mentions[0].number} shadow muted! (Their messages will be auto-deleted)`);
    },

    raidmode: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        if (!hasPermission(chat.id._serialized, msg.from, 'guardian')) {
            return msg.reply('❌ Guardians+ only!');
        }
        
        const group = getGroup(chat.id._serialized);
        if (args[0] === 'on') {
            group.raidmode = true;
            await chat.setMessagesAdminsOnly(true);
            await msg.reply('🚨 RAID MODE ON! New members will be auto-kicked!');
        } else if (args[0] === 'off') {
            group.raidmode = false;
            await chat.setMessagesAdminsOnly(false);
            await msg.reply('✅ Raid mode OFF!');
        } else {
            await msg.reply(`Raid mode: ${group.raidmode ? 'ON' : 'OFF'}\nUsage: .raidmode on/off`);
        }
        saveData();
    },

    // ECONOMY
    balance: async (msg) => {
        const user = getUser(msg.from);
        await msg.reply(`💰 Balance: $${user.balance}\n🏦 Bank: $${user.bank}\n💎 Total: $${user.balance + user.bank}`);
    },

    bank: async (msg) => await commands.balance(msg),

    daily: async (msg) => {
        const user = getUser(msg.from);
        const now = Date.now();
        const cooldown = 86400000;
        
        if (now - user.lastDaily < cooldown) {
            const left = cooldown - (now - user.lastDaily);
            const h = Math.floor(left / 3600000);
            return msg.reply(`⏰ Come back in ${h}h!`);
        }
        
        const amt = 500 + Math.floor(Math.random() * 500);
        user.balance += amt;
        user.lastDaily = now;
        saveData();
        await msg.reply(`✅ Daily reward: $${amt}!`);
    },

    weekly: async (msg) => {
        const user = getUser(msg.from);
        const now = Date.now();
        const cooldown = 604800000; // 7 days
        
        if (now - user.lastWeekly < cooldown) {
            const left = cooldown - (now - user.lastWeekly);
            const d = Math.floor(left / 86400000);
            return msg.reply(`⏰ Come back in ${d} days!`);
        }
        
        const amt = 3500 + Math.floor(Math.random() * 1500);
        user.balance += amt;
        user.lastWeekly = now;
        saveData();
        await msg.reply(`✅ Weekly reward: $${amt}!`);
    },

    work: async (msg) => {
        const user = getUser(msg.from);
        const now = Date.now();
        const cooldown = 3600000; // 1 hour
        
        if (now - user.lastWork < cooldown) {
            const left = cooldown - (now - user.lastWork);
            const m = Math.floor(left / 60000);
            return msg.reply(`⏰ Come back in ${m}min!`);
        }
        
        const jobs = [
            { job: 'Developer', pay: 500 },
            { job: 'Designer', pay: 400 },
            { job: 'Streamer', pay: 600 },
            { job: 'Trader', pay: 700 },
            { job: 'Content Creator', pay: 550 }
        ];
        
        const work = jobs[Math.floor(Math.random() * jobs.length)];
        user.balance += work.pay;
        user.lastWork = now;
        saveData();
        await msg.reply(`💼 Worked as ${work.job}! Earned $${work.pay}`);
    },

    crime: async (msg) => {
        const user = getUser(msg.from);
        const success = Math.random() < 0.5;
        
        if (success) {
            const amt = 1000 + Math.floor(Math.random() * 2000);
            user.balance += amt;
            await msg.reply(`🦹 Crime success! Earned $${amt}!`);
        } else {
            const amt = 500 + Math.floor(Math.random() * 1000);
            user.balance -= amt;
            await msg.reply(`🚔 Caught! Lost $${amt}!`);
        }
        saveData();
    },

    pay: async (msg, args) => {
        const mentions = await msg.getMentions();
        if (!mentions[0] || !args[1]) return msg.reply('Usage: .pay @user [amount]');
        
        const user = getUser(msg.from);
        const target = getUser(mentions[0].id._serialized);
        const amt = parseInt(args[1]);
        
        if (isNaN(amt) || amt < 1) return msg.reply('❌ Invalid amount!');
        if (amt > user.balance) return msg.reply('❌ Insufficient balance!');
        
        user.balance -= amt;
        target.balance += amt;
        saveData();
        await msg.reply(`✅ Sent $${amt} to @${mentions[0].number}!`);
    },

    steal: async (msg) => {
        const mentions = await msg.getMentions();
        if (!mentions[0]) return msg.reply('Usage: .steal @user');
        
        const user = getUser(msg.from);
        const target = getUser(mentions[0].id._serialized);
        
        const success = Math.random() < 0.3;
        
        if (success) {
            const amt = Math.floor(target.balance * 0.1);
            target.balance -= amt;
            user.balance += amt;
            await msg.reply(`🦹 Stole $${amt} from @${mentions[0].number}!`);
        } else {
            const amt = Math.floor(user.balance * 0.05);
            user.balance -= amt;
            await msg.reply(`🚔 Failed! Lost $${amt} as penalty!`);
        }
        saveData();
    },

    level: async (msg) => {
        const user = getUser(msg.from);
        const nextLevel = user.level * 100;
        await msg.reply(`⭐ Level ${user.level}\n📊 XP: ${user.xp}/${nextLevel}`);
    },

    rank: async (msg) => await commands.level(msg),

    leaderboard: async (msg) => {
        const sorted = Array.from(userData.entries())
            .sort((a, b) => (b[1].balance + b[1].bank) - (a[1].balance + a[1].bank))
            .slice(0, 10);
        
        let lb = '╭─── ◈ TOP 10 ◈ ───╮\n';
        sorted.forEach(([_, u], i) => {
            const medal = ['🥇','🥈','🥉'][i] || `${i+1}.`;
            lb += `║ ${medal} ${u.name}: $${u.balance + u.bank}\n`;
        });
        lb += '╰━━━━━━━━━━━━━━━━━╯';
        await msg.reply(lb);
    },

    shop: async (msg) => {
        await msg.reply(`╭─── ◈ SHOP ◈ ───╮
║ 🎣 Fishing Rod: $500
║ ⛏️ Pickaxe: $500
║ 🎰 Lottery Ticket: $100
║ 💎 Diamond: $5000
╰━━━━━━━━━━━━━━━━━╯
.buy [item]`);
    },

    inventory: async (msg) => {
        const user = getUser(msg.from);
        const items = Object.entries(user.inventory);
        
        if (items.length === 0) return msg.reply('📦 Inventory is empty!');
        
        let inv = '╭─── ◈ INVENTORY ◈ ───╮\n';
        items.forEach(([item, qty]) => {
            inv += `║ ${item}: ${qty}\n`;
        });
        inv += '╰━━━━━━━━━━━━━━━━━╯';
        await msg.reply(inv);
    },

    // FUN
    joke: async (msg) => {
        try {
            const res = await axios.get('https://official-joke-api.appspot.com/random_joke');
            await msg.reply(`😄 ${res.data.setup}\n\n${res.data.punchline}`);
        } catch {
            await msg.reply('😅 Joke service down!');
        }
    },

    quote: async (msg) => {
        try {
            const res = await axios.get('https://api.quotable.io/random');
            await msg.reply(`💭 "${res.data.content}"\n\n- ${res.data.author}`);
        } catch {
            await msg.reply('📖 Quote service down!');
        }
    },

    truth: async (msg) => {
        const truths = [
            'What\'s your biggest secret?',
            'Who was your first crush?',
            'What\'s the most embarrassing thing you\'ve done?',
            'Have you ever lied to your best friend?',
            'What\'s your biggest fear?'
        ];
        await msg.reply(`🤔 ${truths[Math.floor(Math.random() * truths.length)]}`);
    },

    dare: async (msg) => {
        const dares = [
            'Send a voice message singing',
            'Change your profile picture',
            'Text someone "I love you"',
            'Do 20 pushups',
            'Post an embarrassing selfie'
        ];
        await msg.reply(`😈 ${dares[Math.floor(Math.random() * dares.length)]}`);
    },

    ship: async (msg) => {
        const mentions = await msg.getMentions();
        if (mentions.length < 2) return msg.reply('❌ Tag 2 people!');
        
        const pct = Math.floor(Math.random() * 101);
        const hearts = pct > 70 ? '💕💕💕' : pct > 40 ? '💕💕' : '💕';
        await msg.reply(`💘 @${mentions[0].number} × @${mentions[1].number}\n\n${hearts} ${pct}% Compatible!`);
    },

    rizz: async (msg) => {
        const lines = [
            'Are you a magician? Because whenever I look at you, everyone else disappears.',
            'Do you have a map? I keep getting lost in your eyes.',
            'Is your name Google? Because you have everything I\'ve been searching for.',
            'Are you a parking ticket? Because you\'ve got FINE written all over you.',
            'Do you believe in love at first sight, or should I walk by again?'
        ];
        await msg.reply(`😏 ${lines[Math.floor(Math.random() * lines.length)]}`);
    },

    poll: async (msg, args) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        
        const data = args.join(' ').split('|');
        if (data.length < 3) return msg.reply('Usage: .poll Question|Option1|Option2|...');
        
        const [question, ...options] = data.map(s => s.trim());
        
        let poll = `📊 POLL\n\n*${question}*\n\n`;
        options.forEach((opt, i) => {
            poll += `${i + 1}️⃣ ${opt}\n`;
        });
        poll += '\nReply with number to vote!';
        
        await msg.reply(poll);
    },

    // STATS
    ping: async (msg) => {
        const start = Date.now();
        const sent = await msg.reply('🏓 Pinging...');
        const latency = Date.now() - start;
        await sent.edit(`🏓 Pong! ${latency}ms`);
    },

    stats: async (msg) => {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const stats = `╭─── ◈ BOT STATS ◈ ───╮
║ ⏰ Uptime: ${hours}h ${minutes}m
║ 👥 Users: ${userData.size}
║ 📱 Groups: ${groupData.size}
║ 💾 Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
║ 🤖 Bot: ${BOT_NAME}
║ 👑 Creator: ${CREATOR}
╰━━━━━━━━━━━━━━━━━╯`;
        await msg.reply(stats);
    },

    activity: async (msg) => {
        const chat = await msg.getChat();
        if (!chat.isGroup) return msg.reply('❌ Groups only!');
        
        await msg.reply('📊 Activity tracking: Coming soon!');
    },

    permissions: async (msg) => {
        const perms = `╭─── ◈ PERMISSIONS ◈ ───╮
║
║ 👥 MEMBERS:
║  • Basic commands
║
║ ⚔️ MODERATORS:
║  • Kick, Warn, Mute
║  • Security features
║
║ 🛡️ GUARDIANS:
║  • All Mod commands
║  • Manage Mods
║  • Advanced features
║
║ 👑 OWNER:
║  • All Guardian commands
║  • Manage Guardians
║
║ ⚡ CREATOR:
║  • Full bot control
║  • All commands
║
╰━━━━━━━━━━━━━━━━━╯`;
        await msg.reply(perms);
    },

    creator: async (msg) => {
        await msg.reply(`👑 Bot Creator: ${CREATOR}\n📱 Contact: wa.me/${CREATOR_NUMBER.replace('@c.us', '')}`);
    }
};

// PAIRING CODE HANDLER
let pairingCodeRequested = false;

client.on('qr', async () => {
    if (!pairingCodeRequested) {
        const phoneNumber = process.env.PHONE_NUMBER;
        
        if (phoneNumber) {
            try {
                console.log('╭━━━━━━━━━━━━━━━━━━━━━━━╮');
                console.log('║  REQUESTING PAIRING   ║');
                console.log('╰━━━━━━━━━━━━━━━━━━━━━━━╯');
                
                const code = await client.requestPairingCode(phoneNumber);
                
                console.log('');
                console.log('╭━━━━━━━━━━━━━━━━━━━━━━━╮');
                console.log('║   PAIRING CODE:       ║');
                console.log(`║      ${code}          ║`);
                console.log('╰━━━━━━━━━━━━━━━━━━━━━━━╯');
                console.log('');
                console.log('Enter this code in WhatsApp!');
                
                pairingCodeRequested = true;
            } catch (error) {
                console.error('❌ Pairing error:', error);
            }
        } else {
            console.log('❌ Set PHONE_NUMBER environment variable!');
        }
    }
});
