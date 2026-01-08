// commands/fun.js

module.exports = {
    joke: async (sock, m, args, reply) => {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? He was outstanding in his field!",
            "What do you call a bear with no teeth? A gummy bear!",
            "Why don't eggs tell jokes? They'd crack each other up!",
            "What's orange and sounds like a parrot? A carrot!",
            "Why did the bicycle fall over? It was two tired!",
            "What do you call a fake noodle? An impasta!",
            "Why did the math book look sad? It had too many problems!",
            "What do you call a can opener that doesn't work? A can't opener!",
            "Why don't skeletons fight each other? They don't have the guts!"
        ];
        reply(`😄 ${jokes[Math.floor(Math.random() * jokes.length)]}`);
    },

    quote: async (sock, m, args, reply) => {
        const quotes = [
            '"The only way to do great work is to love what you do." - Steve Jobs',
            '"Innovation distinguishes between a leader and a follower." - Steve Jobs',
            '"Your time is limited, don\'t waste it living someone else\'s life." - Steve Jobs',
            '"Stay hungry, stay foolish." - Steve Jobs',
            '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
            '"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill',
            '"Believe you can and you\'re halfway there." - Theodore Roosevelt',
            '"The only impossible journey is the one you never begin." - Tony Robbins',
            '"Life is 10% what happens to you and 90% how you react to it." - Charles R. Swindoll',
            '"The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb'
        ];
        reply(`💭 ${quotes[Math.floor(Math.random() * quotes.length)]}`);
    },

    truth: async (sock, m, args, reply) => {
        const truths = [
            "What's your biggest fear?",
            "What's the most embarrassing thing you've done?",
            "Who was your first crush?",
            "What's your biggest regret?",
            "What's a secret you've never told anyone?",
            "Have you ever lied to your best friend?",
            "What's the weirdest dream you've ever had?",
            "If you could change one thing about yourself, what would it be?",
            "What's something you're glad your parents don't know about you?",
            "Who in this group do you trust the most?"
        ];
        reply(`🎲 *Truth:*\n\n${truths[Math.floor(Math.random() * truths.length)]}`);
    },

    dare: async (sock, m, args, reply) => {
        const dares = [
            "Send a voice message singing your favorite song!",
            "Change your status to something embarrassing for 24 hours!",
            "Send a funny selfie to the group!",
            "Do 10 pushups and send proof!",
            "Text your crush saying 'I like you'!",
            "Change your profile picture to something funny for 1 hour!",
            "Call someone random and sing happy birthday!",
            "Post an embarrassing childhood photo!",
            "Let someone in the group send a message from your phone!",
            "Do your best impression of someone in the group!"
        ];
        reply(`🎲 *Dare:*\n\n${dares[Math.floor(Math.random() * dares.length)]}`);
    },

    ship: async (sock, m, args, reply) => {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length < 2) {
            return reply('❌ Tag 2 people to ship!\n\nExample: .ship @user1 @user2');
        }
        
        const percentage = Math.floor(Math.random() * 101);
        const hearts = percentage > 70 ? '💖💖💖' : percentage > 40 ? '💕💕' : '💔';
        
        const messages = [
            percentage > 80 ? "Perfect match! 🔥" : 
            percentage > 60 ? "Great chemistry! ✨" :
            percentage > 40 ? "It could work! 💫" :
            percentage > 20 ? "Maybe as friends? 🤷" :
            "Not meant to be... 😢"
        ];
        
        reply(`💘 *Ship Result*\n\n@${mentioned[0].split('@')[0]} ❤️ @${mentioned[1].split('@')[0]}\n\n${hearts} ${percentage}% Match!\n\n${messages}`);
    },

    rizz: async (sock, m, args, reply) => {
        const lines = [
            "Are you a magician? Because whenever I look at you, everyone else disappears!",
            "Do you have a map? I keep getting lost in your eyes.",
            "Is your name Google? Because you have everything I've been searching for.",
            "Are you a parking ticket? Because you've got 'fine' written all over you!",
            "Do you believe in love at first sight, or should I walk by again?",
            "Are you Wi-Fi? Because I'm feeling a connection!",
            "If you were a vegetable, you'd be a cute-cumber!",
            "Do you have a Band-Aid? Because I just scraped my knee falling for you!",
            "Are you a camera? Because every time I look at you, I smile!",
            "Is your name Chapstick? Because you're da balm!"
        ];
        reply(`😏 *Rizz Line:*\n\n${lines[Math.floor(Math.random() * lines.length)]}`);
    },

    poll: async (sock, m, args, reply, sender) => {
        const question = args.join(' ');
        if (!question) return reply('❌ Usage: .poll <question>\n\nExample: .poll Should we add new features?');
        
        reply(`📊 *Poll Created!*\n\n${question}\n\n👍 - Yes\n👎 - No\n\nReact to vote!`);
    }
};
