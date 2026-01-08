// utils/hierarchy.js
const { loadData, saveData } = require('./database');

// Permission levels
const PERMISSIONS = {
    OWNER: 3,
    MODERATOR: 2,
    GUARDIAN: 1,
    USER: 0
};

// Get user's permission level
function getUserPermission(userId, CREATOR) {
    if (userId === CREATOR) return PERMISSIONS.OWNER;
    
    const hierarchy = loadData('settings').hierarchy || { mods: [], guardians: [] };
    
    if (hierarchy.mods.includes(userId)) return PERMISSIONS.MODERATOR;
    if (hierarchy.guardians.includes(userId)) return PERMISSIONS.GUARDIAN;
    
    return PERMISSIONS.USER;
}

// Add moderator
function addModerator(userId) {
    const settings = loadData('settings');
    if (!settings.hierarchy) settings.hierarchy = { mods: [], guardians: [] };
    
    // Remove from guardians if exists
    settings.hierarchy.guardians = settings.hierarchy.guardians.filter(id => id !== userId);
    
    // Add to mods if not already
    if (!settings.hierarchy.mods.includes(userId)) {
        settings.hierarchy.mods.push(userId);
        saveData('settings', settings);
        return true;
    }
    return false;
}

// Add guardian
function addGuardian(userId) {
    const settings = loadData('settings');
    if (!settings.hierarchy) settings.hierarchy = { mods: [], guardians: [] };
    
    // Don't add if already a mod
    if (settings.hierarchy.mods.includes(userId)) return false;
    
    // Add to guardians if not already
    if (!settings.hierarchy.guardians.includes(userId)) {
        settings.hierarchy.guardians.push(userId);
        saveData('settings', settings);
        return true;
    }
    return false;
}

// Remove from hierarchy
function removeFromHierarchy(userId) {
    const settings = loadData('settings');
    if (!settings.hierarchy) return false;
    
    const wasMod = settings.hierarchy.mods.includes(userId);
    const wasGuardian = settings.hierarchy.guardians.includes(userId);
    
    settings.hierarchy.mods = settings.hierarchy.mods.filter(id => id !== userId);
    settings.hierarchy.guardians = settings.hierarchy.guardians.filter(id => id !== userId);
    
    saveData('settings', settings);
    return wasMod || wasGuardian;
}

// Get hierarchy display
function getHierarchyDisplay(sock, CREATOR) {
    const settings = loadData('settings');
    const hierarchy = settings.hierarchy || { mods: [], guardians: [] };
    
    const modsList = hierarchy.mods.length > 0 
        ? hierarchy.mods.map(id => `║  ├─ @${id.split('@')[0]}`).join('\n')
        : '║  └─ None';
    
    const guardiansList = hierarchy.guardians.length > 0
        ? hierarchy.guardians.map(id => `║  ├─ @${id.split('@')[0]}`).join('\n')
        : '║  └─ None';
    
    const totalStaff = 1 + hierarchy.mods.length + hierarchy.guardians.length;
    
    return {
        text: `╭━━━━ ◈ MOD HIERARCHY ◈ ━━━━╮
║
║ 👑 OWNER
║  └─ @${CREATOR.split('@')[0]}
║
║ ⚔️ MODERATORS (${hierarchy.mods.length})
${modsList}
║
║ 🛡️ GUARDIANS (${hierarchy.guardians.length})
${guardiansList}
║
║ 📊 Total Staff: ${totalStaff}
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

📋 PERMISSIONS:
👑 Owner - Full Control
⚔️ Moderators - Admin + Ban/Kick
🛡️ Guardians - Warn/Mute/Lock

Type .permissions to see your level`,
        mentions: [CREATOR, ...hierarchy.mods, ...hierarchy.guardians]
    };
}

// Get all mods and guardians
function getStaffList() {
    const settings = loadData('settings');
    return settings.hierarchy || { mods: [], guardians: [] };
}

// Check if user is staff
function isStaff(userId) {
    const hierarchy = getStaffList();
    return hierarchy.mods.includes(userId) || hierarchy.guardians.includes(userId);
}

// Check permissions
function hasPermission(userId, requiredLevel, CREATOR) {
    const userLevel = getUserPermission(userId, CREATOR);
    return userLevel >= requiredLevel;
}

module.exports = {
    PERMISSIONS,
    getUserPermission,
    addModerator,
    addGuardian,
    removeFromHierarchy,
    getHierarchyDisplay,
    getStaffList,
    isStaff,
    hasPermission
};
