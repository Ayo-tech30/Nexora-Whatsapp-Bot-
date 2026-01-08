// utils/database.js
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data');
const FILES = {
    users: path.join(DB_PATH, 'users.json'),
    groups: path.join(DB_PATH, 'groups.json'),
    economy: path.join(DB_PATH, 'economy.json'),
    bans: path.join(DB_PATH, 'bans.json'),
    settings: path.join(DB_PATH, 'settings.json'),
    logs: path.join(DB_PATH, 'logs.json')
};

// Initialize database
function initDB() {
    if (!fs.existsSync(DB_PATH)) {
        fs.mkdirSync(DB_PATH, { recursive: true });
    }

    Object.keys(FILES).forEach(key => {
        if (!fs.existsSync(FILES[key])) {
            fs.writeFileSync(FILES[key], JSON.stringify({}));
        }
    });
}

function loadData(file) {
    try {
        const data = fs.readFileSync(FILES[file], 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

function saveData(file, data) {
    try {
        fs.writeFileSync(FILES[file], JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error saving ${file}:`, error);
        return false;
    }
}

function getUserData(userId) {
    const users = loadData('users');
    if (!users[userId]) {
        users[userId] = {
            id: userId,
            level: 1,
            xp: 0,
            warnings: 0,
            muted: false,
            joinedAt: Date.now()
        };
        saveData('users', users);
    }
    return users[userId];
}

function updateUserData(userId, updates) {
    const users = loadData('users');
    if (!users[userId]) {
        users[userId] = getUserData(userId);
    }
    users[userId] = { ...users[userId], ...updates };
    saveData('users', users);
    return users[userId];
}

function getGroupData(groupId) {
    const groups = loadData('groups');
    if (!groups[groupId]) {
        groups[groupId] = {
            id: groupId,
            rules: '',
            antilink: false,
            antispam: false,
            antibot: false,
            locked: false,
            slowmode: 0,
            raidmode: false,
            settings: {}
        };
        saveData('groups', groups);
    }
    return groups[groupId];
}

function updateGroupData(groupId, updates) {
    const groups = loadData('groups');
    if (!groups[groupId]) {
        groups[groupId] = getGroupData(groupId);
    }
    groups[groupId] = { ...groups[groupId], ...updates };
    saveData('groups', groups);
    return groups[groupId];
}

function getEconomyData(userId) {
    const economy = loadData('economy');
    if (!economy[userId]) {
        economy[userId] = {
            balance: 100,
            bank: 0,
            lastDaily: 0,
            lastWeekly: 0,
            lastWork: 0,
            inventory: []
        };
        saveData('economy', economy);
    }
    return economy[userId];
}

function updateEconomyData(userId, updates) {
    const economy = loadData('economy');
    if (!economy[userId]) {
        economy[userId] = getEconomyData(userId);
    }
    economy[userId] = { ...economy[userId], ...updates };
    saveData('economy', economy);
    return economy[userId];
}

function addLog(type, data) {
    const logs = loadData('logs');
    const timestamp = Date.now();
    const logId = `${type}_${timestamp}`;
    
    logs[logId] = {
        type,
        timestamp,
        ...data
    };
    
    saveData('logs', logs);
}

function getBanStatus(userId) {
    const bans = loadData('bans');
    if (!bans[userId]) return { banned: false };
    
    if (bans[userId].tempban && bans[userId].banUntil < Date.now()) {
        delete bans[userId];
        saveData('bans', bans);
        return { banned: false };
    }
    
    return bans[userId];
}

function banUser(userId, reason = 'No reason', tempban = false, duration = 0) {
    const bans = loadData('bans');
    bans[userId] = {
        banned: true,
        reason,
        tempban,
        bannedAt: Date.now(),
        banUntil: tempban ? Date.now() + duration : null
    };
    saveData('bans', bans);
    addLog('ban', { userId, reason, tempban, duration });
}

function unbanUser(userId) {
    const bans = loadData('bans');
    delete bans[userId];
    saveData('bans', bans);
    addLog('unban', { userId });
}

// Initialize on load
initDB();

module.exports = {
    loadData,
    saveData,
    getUserData,
    updateUserData,
    getGroupData,
    updateGroupData,
    getEconomyData,
    updateEconomyData,
    addLog,
    getBanStatus,
    banUser,
    unbanUser
};
