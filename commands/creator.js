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
        reply(`✅ Command "${command}" has been disabled globally!`);
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

    disabledlist: async (sock, m, args, reply) => {
        const settings = loadData('settings');
        const disabled = settings.disabled || [];
        
        if (disabled.length === 0) {
            return reply('✅ No commands are currently disabled!');
        }
        
        const list = disabled.map((cmd, i) => `${i + 1}. ${cmd}`).join('\n');
        reply(`🚫 *Disabled Commands*\n\n${list}\n\nTotal: ${disabled.length}`);
    },

    cooldown: async (sock, m, args, reply) => {
        const command = args[0];
        const time = parseInt(args[1]);
        
        if (!command || !time) {
            return reply('❌ Usage: .cooldown <command> <seconds>\n\nExample: .cooldown work 3600');
        }
        
        const settings = loadData('settings');
        if (!settings.cooldowns) settings.cooldowns = {};
        
        settings.cooldowns[command] = time * 1000;
        saveData('settings', settings);
        
        reply(`✅ Cooldown set for "${command}": ${time} seconds`);
    },

    ratelimit: async (sock, m, args, reply) => {
        const command = args[0];
        const limit = parseInt(args[1]);
        
        if (!command || !limit) {
            return reply('❌ Usage: .ratelimit <command> <uses per minute>\n\nExample: .ratelimit joke 5');
        }
        
        const settings = loadData('settings');
        if (!settings.ratelimits) settings.ratelimits = {};
        
        settings.ratelimits[command] = limit;
        saveData('settings', settings);
        
        reply(`✅ Rate limit set for "${command}": ${limit} uses per minute`);
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
    },

    eval: async (sock, m, args, reply, sender, isGroup) => {
        const code = args.join(' ');
        if (!code) return reply('❌ Usage: .eval <code>\n\nExample: .eval 1 + 1');
        
        try {
            let result = eval(code);
            if (typeof result === 'object') result = JSON.stringify(result, null, 2);
            reply(`✅ *Eval Result:*\n\n\`\`\`${result}\`\`\``);
        } catch (error) {
            reply(`❌ *Eval Error:*\n\n\`\`\`${error.message}\`\`\``);
        }
    },

    exec: async (sock, m, args, reply) => {
        const command = args.join(' ');
        if (!command) return reply('❌ Usage: .exec <command>\n\nExample: .exec ls -la');
        
        const { exec } = require('child_process');
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reply(`❌ *Exec Error:*\n\n\`\`\`${error.message}\`\`\``);
            }
            if (stderr) {
                return reply(`⚠️ *Stderr:*\n\n\`\`\`${stderr}\`\`\``);
            }
            reply(`✅ *Exec Output:*\n\n\`\`\`${stdout || 'No output'}\`\`\``);
        });
    },

    broadcast: async (sock, m, args, reply) => {
        const message = args.join(' ');
        if (!message) return reply('❌ Usage: .broadcast <message>\n\nBroadcasts to all groups');
        
        const groups = loadData('groups');
        const groupIds = Object.keys(groups);
        
        let success = 0;
        for (const groupId of groupIds) {
            try {
                await sock.sendMessage(groupId, { text: `📢 *Broadcast from Creator (Kynx)*\n\n${message}` });
                success++;
            } catch (error) {
                console.error(`Failed to send to ${groupId}`);
            }
        }
        
        reply(`✅ Broadcast sent to ${success}/${groupIds.length} groups!`);
    },

    globalmute: async (sock, m, args, reply) => {
        const status = args[0]?.toLowerCase();
        if (!['on', 'off'].includes(status)) {
            return reply('❌ Usage: .globalmute on/off\n\nMutes bot in ALL groups');
        }
        
        const settings = loadData('settings');
        settings.globalmute = status === 'on';
        saveData('settings', settings);
        
        reply(`${status === 'on' ? '🔇' : '🔊'} Global mute ${status === 'on' ? 'enabled' : 'disabled'}!\n\nBot will ${status === 'on' ? 'not respond' : 'respond normally'} in all groups.`);
    },

    resetbot: async (sock, m, args, reply) => {
        if (!args[0] || args[0] !== 'confirm') {
            return reply('⚠️ *WARNING: This will reset ALL bot data!*\n\nType: .resetbot confirm');
        }
        
        reply('🔄 Resetting bot data...');
        
        const settings = { hierarchy: { mods: [], guardians: [] } };
        saveData('settings', settings);
        saveData('users', {});
        saveData('groups', {});
        saveData('economy', {});
        saveData('bans', {});
        saveData('logs', {});
        
        reply('✅ Bot data has been reset!\n\nAll users, economy, and settings cleared.');
    },

    alias: async (sock, m, args, reply) => {
        const [command, alias] = args;
        if (!command || !alias) {
            return reply('❌ Usage: .alias <command> <alias>\n\nExample: .alias balance bal');
        }
        
        const settings = loadData('settings');
        if (!settings.aliases) settings.aliases = {};
        
        settings.aliases[alias] = command;
        saveData('settings', settings);
        
        reply(`✅ Alias created!\n\n.${alias} → .${command}`);
    },

    usage: async (sock, m, args, reply) => {
        const command = args[0];
        if (!command) return reply('❌ Usage: .usage <command>\n\nShows command statistics');
        
        const { loadData } = require('../utils/database');
        const logs = loadData('logs');
        
        const uses = Object.values(logs).filter(log => log.command === command).length;
        
        reply(`📊 *Command Usage Stats*\n\nCommand: .${command}\nTotal Uses: ${uses}\n\nLast used: ${uses > 0 ? 'Recently' : 'Never'}`);
    },

    logs: async (sock, m, args, reply) => {
        const { loadData } = require('../utils/database');
        const logs = loadData('logs');
        
        const recent = Object.values(logs)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 20);
        
        if (recent.length === 0) {
            return reply('📋 No logs found!');
        }
        
        const logList = recent.map((log, i) => {
            const date = new Date(log.timestamp).toLocaleString();
            return `${i + 1}. [${log.type?.toUpperCase() || 'ACTION'}] ${date}`;
        }).join('\n');
        
        reply(`📋 *Recent Logs (Last 20)*\n\n${logList}`);
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