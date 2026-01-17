// commands/economy.js
const { getEconomyData, updateEconomyData } = require('../utils/database');

module.exports = {
    balance: async (sock, m, args, reply, senderNumber) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || senderNumber;
        const eco = getEconomyData(mentioned);
        
        reply(`💰 *Balance*\n\n@${mentioned.split('@')[0]}\n\n💵 Wallet: $${eco.balance}\n🏦 Bank: $${eco.bank}\n📊 Total: $${eco.balance + eco.bank}`);
    },

    bank: async (sock, m, args, reply, senderNumber) => {
        const eco = getEconomyData(senderNumber);
        reply(`🏦 *Bank Account*\n\n💵 Balance: $${eco.bank}\n\nUse .deposit or .withdraw to manage your money!`);
    },

    daily: async (sock, m, args, reply, senderNumber) => {
        const eco = getEconomyData(senderNumber);
        const now = Date.now();
        const dayMs = 86400000;
        
        if (eco.lastDaily && now - eco.lastDaily < dayMs) {
            const timeLeft = dayMs - (now - eco.lastDaily);
            const hours = Math.floor(timeLeft / 3600000);
            return reply(`⏰ Daily reward already claimed!\n\nCome back in ${hours} hours.`);
        }
        
        const reward = 500;
        updateEconomyData(senderNumber, { 
            balance: eco.balance + reward,
            lastDaily: now
        });
        
        reply(`🎁 *Daily Reward!*\n\n💵 +$${reward}\n💰 New balance: $${eco.balance + reward}`);
    },

    weekly: async (sock, m, args, reply, senderNumber) => {
        const eco = getEconomyData(senderNumber);
        const now = Date.now();
        const weekMs = 604800000;
        
        if (eco.lastWeekly && now - eco.lastWeekly < weekMs) {
            const timeLeft = weekMs - (now - eco.lastWeekly);
            const days = Math.floor(timeLeft / 86400000);
            return reply(`⏰ Weekly reward already claimed!\n\nCome back in ${days} days.`);
        }
        
        const reward = 3500;
        updateEconomyData(senderNumber, { 
            balance: eco.balance + reward,
            lastWeekly: now
        });
        
        reply(`🎁 *Weekly Reward!*\n\n💵 +$${reward}\n💰 New balance: $${eco.balance + reward}`);
    },

    work: async (sock, m, args, reply, senderNumber) => {
        const eco = getEconomyData(senderNumber);
        const now = Date.now();
        const workCooldown = 3600000; // 1 hour
        
        if (eco.lastWork && now - eco.lastWork < workCooldown) {
            const timeLeft = workCooldown - (now - eco.lastWork);
            const minutes = Math.floor(timeLeft / 60000);
            return reply(`⏰ You're tired! Rest for ${minutes} more minutes.`);
        }
        
        const jobs = [
            { name: 'Developer', min: 200, max: 500 },
            { name: 'Teacher', min: 150, max: 350 },
            { name: 'Chef', min: 180, max: 400 },
            { name: 'Driver', min: 120, max: 300 }
        ];
        
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const earned = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;
        
        updateEconomyData(senderNumber, { 
            balance: eco.balance + earned,
            lastWork: now
        });
        
        reply(`💼 *Work Complete!*\n\nJob: ${job.name}\n💵 Earned: $${earned}\n💰 Balance: $${eco.balance + earned}`);
    },

    crime: async (sock, m, args, reply, senderNumber) => {
        const eco = getEconomyData(senderNumber);
        const success = Math.random() > 0.5;
        
        if (success) {
            const reward = Math.floor(Math.random() * 500) + 200;
            updateEconomyData(senderNumber, { balance: eco.balance + reward });
            reply(`🎭 *Crime Successful!*\n\n💵 Gained: $${reward}\n💰 Balance: $${eco.balance + reward}`);
        } else {
            const fine = Math.floor(Math.random() * 300) + 100;
            const newBalance = Math.max(0, eco.balance - fine);
            updateEconomyData(senderNumber, { balance: newBalance });
            reply(`🚔 *Caught!*\n\n💸 Fine: $${fine}\n💰 Balance: $${newBalance}`);
        }
    },

    pay: async (sock, m, args, reply, senderNumber) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const amount = parseInt(args[0]);
        
        if (!mentioned || !amount || amount <= 0) {
            return reply('❌ Usage: .pay <amount> @user\n\nExample: .pay 500 @user');
        }
        
        const senderEco = getEconomyData(senderNumber);
        if (senderEco.balance < amount) {
            return reply(`❌ Insufficient funds! You have $${senderEco.balance}`);
        }
        
        const receiverEco = getEconomyData(mentioned);
        
        updateEconomyData(senderNumber, { balance: senderEco.balance - amount });
        updateEconomyData(mentioned, { balance: receiverEco.balance + amount });
        
        reply(`💸 *Payment Sent!*\n\nFrom: @${senderNumber.split('@')[0]}\nTo: @${mentioned.split('@')[0]}\nAmount: $${amount}`);
    },

    steal: async (sock, m, args, reply, senderNumber) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            return reply('❌ Usage: .steal @user');
        }
        
        const success = Math.random() > 0.6; // 40% success rate
        const senderEco = getEconomyData(senderNumber);
        const targetEco = getEconomyData(mentioned);
        
        if (success && targetEco.balance > 0) {
            const stolen = Math.floor(Math.random() * Math.min(targetEco.balance, 500)) + 50;
            updateEconomyData(senderNumber, { balance: senderEco.balance + stolen });
            updateEconomyData(mentioned, { balance: targetEco.balance - stolen });
            reply(`🦹 *Steal Successful!*\n\n💰 Stole: $${stolen} from @${mentioned.split('@')[0]}\n💵 Your balance: $${senderEco.balance + stolen}`);
        } else {
            const fine = Math.floor(Math.random() * 300) + 100;
            const newBalance = Math.max(0, senderEco.balance - fine);
            updateEconomyData(senderNumber, { balance: newBalance });
            reply(`🚔 *Caught Stealing!*\n\n💸 Fine: $${fine}\n💰 Balance: $${newBalance}`);
        }
    },

    level: async (sock, m, args, reply, senderNumber) => {
        const { getUserData } = require('../utils/database');
        const userData = getUserData(senderNumber);
        
        const level = userData.level || 1;
        const xp = userData.xp || 0;
        const nextLevelXp = level * 100;
        
        reply(`📊 *Level Stats*\n\n@${senderNumber.split('@')[0]}\n\n🎯 Level: ${level}\n⭐ XP: ${xp}/${nextLevelXp}\n📈 Progress: ${Math.floor((xp/nextLevelXp)*100)}%`);
    },

    rank: async (sock, m, args, reply, senderNumber) => {
        const { getUserData } = require('../utils/database');
        const userData = getUserData(senderNumber);
        
        const level = userData.level || 1;
        const xp = userData.xp || 0;
        const nextLevelXp = level * 100;
        
        reply(`📊 *Rank*\n\n@${senderNumber.split('@')[0]}\n\n🎯 Level: ${level}\n⭐ XP: ${xp}/${nextLevelXp}`);
    },

    leaderboard: async (sock, m, args, reply, sender) => {
        const { loadData } = require('../utils/database');
        const economy = loadData('economy');
        
        const sorted = Object.entries(economy)
            .map(([id, data]) => ({ id, total: data.balance + data.bank }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);
        
        const board = sorted.map((user, i) => 
            `${i + 1}. @${user.id.split('@')[0]} - $${user.total}`
        ).join('\n');
        
        reply(`🏆 *Top 10 Richest*\n\n${board || 'No data yet!'}`);
    },

    shop: async (sock, m, args, reply) => {
        const shop = `🛒 *Shop*\n\n1. 💎 VIP Pass - $5000\n2. 🎭 Name Color - $2000\n3. 🛡️ Protection - $1500\n4. ⚡ XP Boost - $1000\n\nUse .buy <number> to purchase!`;
        reply(shop);
    },

    inventory: async (sock, m, args, reply, senderNumber) => {
        const eco = getEconomyData(senderNumber);
        const items = eco.inventory && eco.inventory.length > 0 
            ? eco.inventory.map((item, i) => `${i + 1}. ${item}`).join('\n')
            : 'Empty';
        
        reply(`🎒 *Inventory*\n\n${items}`);
    },

    monthly: async (sock, m, args, reply, senderNumber) => {
        const eco = getEconomyData(senderNumber);
        const now = Date.now();
        const monthMs = 2592000000; // 30 days
        
        if (eco.lastMonthly && now - eco.lastMonthly < monthMs) {
            const timeLeft = monthMs - (now - eco.lastMonthly);
            const days = Math.floor(timeLeft / 86400000);
            return reply(`⏰ Monthly reward already claimed!\n\nCome back in ${days} days.`);
        }
        
        const reward = 15000;
        updateEconomyData(senderNumber, { 
            balance: eco.balance + reward,
            lastMonthly: now
        });
        
        reply(`🎁 *Monthly Reward!*\n\n💵 +$${reward.toLocaleString()}\n💰 New balance: $${(eco.balance + reward).toLocaleString()}`);
    },

    rob: async (sock, m, args, reply, senderNumber) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (!mentioned) {
            return reply('❌ Usage: .rob @user\n\nTry to rob someone!');
        }
        
        const success = Math.random() > 0.7; // 30% success rate
        const senderEco = getEconomyData(senderNumber);
        const targetEco = getEconomyData(mentioned);
        
        if (success && targetEco.balance > 0) {
            const stolen = Math.floor(Math.random() * Math.min(targetEco.balance, 1000)) + 100;
            updateEconomyData(senderNumber, { balance: senderEco.balance + stolen });
            updateEconomyData(mentioned, { balance: targetEco.balance - stolen });
            reply(`🦹 *Robbery Successful!*\n\n💰 Robbed: $${stolen.toLocaleString()} from @${mentioned.split('@')[0]}\n💵 Your balance: $${(senderEco.balance + stolen).toLocaleString()}`);
        } else {
            const fine = Math.floor(Math.random() * 500) + 200;
            const newBalance = Math.max(0, senderEco.balance - fine);
            updateEconomyData(senderNumber, { balance: newBalance });
            reply(`🚔 *Caught Robbing!*\n\n💸 Fine: $${fine.toLocaleString()}\n💰 Balance: $${newBalance.toLocaleString()}`);
        }
    },

    use: async (sock, m, args, reply, senderNumber) => {
        const item = args.join(' ');
        if (!item) return reply('❌ Usage: .use <item>\n\nExample: .use XP Boost');
        
        const eco = getEconomyData(senderNumber);
        if (!eco.inventory || !eco.inventory.includes(item)) {
            return reply(`❌ You don't have "${item}" in your inventory!\n\nUse .inventory to check your items`);
        }
        
        reply(`✅ Used item: ${item}\n\n⚠️ Item effects system under development`);
    },

    profile: async (sock, m, args, reply, senderNumber) => {
        const { getUserData } = require('../utils/database');
        const userData = getUserData(senderNumber);
        const eco = getEconomyData(senderNumber);
        
        const profile = `👤 *User Profile*\n\n@${senderNumber.split('@')[0]}\n\n💰 Balance: $${eco.balance.toLocaleString()}\n🏦 Bank: $${eco.bank.toLocaleString()}\n🎯 Level: ${userData.level || 1}\n⭐ XP: ${userData.xp || 0}\n⚠️ Warnings: ${userData.warnings || 0}/3\n🎒 Items: ${eco.inventory?.length || 0}`;
        
        reply(profile);
    },

    reseteco: async (sock, m, args, reply, senderNumber) => {
        if (!args[0] || args[0] !== 'confirm') {
            return reply('⚠️ *WARNING: This will reset YOUR economy data!*\n\nType: .reseteco confirm');
        }
        
        updateEconomyData(senderNumber, {
            balance: 500,
            bank: 0,
            lastDaily: 0,
            lastWeekly: 0,
            lastMonthly: 0,
            lastWork: 0,
            inventory: []
        });
        
        reply('✅ Your economy data has been reset!\n\n💰 Balance: $500\n🏦 Bank: $0');
    }
};