// commands/hierarchy.js
const { 
    addModerator, 
    addGuardian, 
    removeFromHierarchy, 
    getHierarchyDisplay,
    getUserPermission,
    PERMISSIONS
} = require('../utils/hierarchy');
const { addLog } = require('../utils/database');

module.exports = {
    // Show mod hierarchy
    mods: async (sock, m, args, reply, CREATOR) => {
        const display = getHierarchyDisplay(sock, CREATOR);
        await sock.sendMessage(m.key.remoteJid, { 
            text: display.text, 
            mentions: display.mentions 
        });
    },

    // Add moderator (Owner only)
    addmod: async (sock, m, args, reply, senderNumber, CREATOR) => {
        if (senderNumber !== CREATOR) {
            return reply('👑 Only the owner can add moderators!');
        }
        
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            return reply('❌ Usage: .addmod @user\n\nExample: .addmod @username');
        }
        
        const success = addModerator(mentioned);
        
        if (success) {
            addLog('addmod', { user: mentioned, by: senderNumber });
            await sock.sendMessage(m.key.remoteJid, {
                text: `✅ *Moderator Added!*\n\n@${mentioned.split('@')[0]} is now a moderator!\n\n⚔️ Permissions:\n• All admin commands\n• Ban/Kick users\n• Manage warnings\n• Access mod tools`,
                mentions: [mentioned]
            });
        } else {
            reply('❌ User is already a moderator!');
        }
    },

    // Add guardian (Owner & Mods)
    addguardian: async (sock, m, args, reply, senderNumber, CREATOR) => {
        const userPerm = getUserPermission(senderNumber, CREATOR);
        
        if (userPerm < PERMISSIONS.MODERATOR) {
            return reply('⚔️ Only owner and moderators can add guardians!');
        }
        
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            return reply('❌ Usage: .addguardian @user\n\nExample: .addguardian @username');
        }
        
        const success = addGuardian(mentioned);
        
        if (success) {
            addLog('addguardian', { user: mentioned, by: senderNumber });
            await sock.sendMessage(m.key.remoteJid, {
                text: `✅ *Guardian Added!*\n\n@${mentioned.split('@')[0]} is now a guardian!\n\n🛡️ Permissions:\n• Warn users\n• Mute/Unmute\n• Lock/Unlock groups\n• View reports`,
                mentions: [mentioned]
            });
        } else {
            reply('❌ User is already a guardian or moderator!');
        }
    },

    // Remove from hierarchy (Owner only)
    removestaff: async (sock, m, args, reply, senderNumber, CREATOR) => {
        if (senderNumber !== CREATOR) {
            return reply('👑 Only the owner can remove staff members!');
        }
        
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            return reply('❌ Usage: .removestaff @user\n\nExample: .removestaff @username');
        }
        
        if (mentioned === CREATOR) {
            return reply('❌ Cannot remove the owner from hierarchy!');
        }
        
        const success = removeFromHierarchy(mentioned);
        
        if (success) {
            addLog('removestaff', { user: mentioned, by: senderNumber });
            await sock.sendMessage(m.key.remoteJid, {
                text: `✅ *Staff Removed!*\n\n@${mentioned.split('@')[0]} has been removed from the staff team.`,
                mentions: [mentioned]
            });
        } else {
            reply('❌ User is not a staff member!');
        }
    },

    // Demote mod to guardian (Owner only)
    demotemod: async (sock, m, args, reply, senderNumber, CREATOR) => {
        if (senderNumber !== CREATOR) {
            return reply('👑 Only the owner can demote moderators!');
        }
        
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            return reply('❌ Usage: .demotemod @user');
        }
        
        removeFromHierarchy(mentioned);
        const success = addGuardian(mentioned);
        
        if (success) {
            addLog('demotemod', { user: mentioned, by: senderNumber });
            await sock.sendMessage(m.key.remoteJid, {
                text: `⬇️ *Moderator Demoted!*\n\n@${mentioned.split('@')[0]} is now a guardian.`,
                mentions: [mentioned]
            });
        } else {
            reply('❌ Failed to demote user!');
        }
    },

    // Promote guardian to mod (Owner only)
    promoteguardian: async (sock, m, args, reply, senderNumber, CREATOR) => {
        if (senderNumber !== CREATOR) {
            return reply('👑 Only the owner can promote guardians!');
        }
        
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            return reply('❌ Usage: .promoteguardian @user');
        }
        
        removeFromHierarchy(mentioned);
        const success = addModerator(mentioned);
        
        if (success) {
            addLog('promoteguardian', { user: mentioned, by: senderNumber });
            await sock.sendMessage(m.key.remoteJid, {
                text: `⬆️ *Guardian Promoted!*\n\n@${mentioned.split('@')[0]} is now a moderator!`,
                mentions: [mentioned]
            });
        } else {
            reply('❌ Failed to promote user!');
        }
    },

    // List all staff
    staff: async (sock, m, args, reply, CREATOR) => {
        const display = getHierarchyDisplay(sock, CREATOR);
        await sock.sendMessage(m.key.remoteJid, { 
            text: display.text, 
            mentions: display.mentions 
        });
    },

    // Check own rank
    myrank: async (sock, m, args, reply, senderNumber, CREATOR) => {
        const permission = getUserPermission(senderNumber, CREATOR);
        
        const ranks = {
            [PERMISSIONS.OWNER]: '👑 Owner',
            [PERMISSIONS.MODERATOR]: '⚔️ Moderator',
            [PERMISSIONS.GUARDIAN]: '🛡️ Guardian',
            [PERMISSIONS.USER]: '👤 User'
        };
        
        const rankName = ranks[permission];
        
        const permissions = {
            [PERMISSIONS.OWNER]: '• Full bot control\n• Add/remove staff\n• All commands\n• System management',
            [PERMISSIONS.MODERATOR]: '• Ban/kick users\n• Admin commands\n• Warning system\n• Moderation tools',
            [PERMISSIONS.GUARDIAN]: '• Warn users\n• Mute/unmute\n• Lock groups\n• View reports',
            [PERMISSIONS.USER]: '• Use public commands\n• Economy features\n• Fun commands'
        };
        
        reply(`📊 *Your Rank*\n\n@${senderNumber.split('@')[0]}\n\n${rankName}\n\n🔑 Permissions:\n${permissions[permission]}`);
    }
};
