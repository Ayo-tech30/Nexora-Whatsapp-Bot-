// commands/ai.js
const { getGroupData, updateGroupData } = require('../utils/database');

// Simple AI responses (you can integrate with OpenAI, Claude API, or any AI service)
const aiResponses = {
    greetings: ['Hello! How can I help you today?', 'Hi there! What can I do for you?', 'Hey! Need assistance?'],
    thanks: ['You\'re welcome!', 'Happy to help!', 'Anytime!'],
    bye: ['Goodbye!', 'See you later!', 'Take care!']
};

function getRandomResponse(category) {
    const responses = aiResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
}

async function analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'awesome', 'excellent', 'happy', 'love', 'wonderful', 'amazing'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'sad', 'horrible', 'worst'];
    
    const lowerText = text.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
        if (lowerText.includes(word)) score++;
    });
    
    negativeWords.forEach(word => {
        if (lowerText.includes(word)) score--;
    });
    
    if (score > 0) return '😊 Positive';
    if (score < 0) return '😔 Negative';
    return '😐 Neutral';
}

module.exports = {
    ai: async (sock, m, args, reply) => {
        const query = args.join(' ');
        if (!query) return reply('💡 Usage: .ai <your question>\n\nExample: .ai What is the meaning of life?');
        
        // Simple AI logic (you can replace with actual AI API)
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
            return reply(getRandomResponse('greetings'));
        }
        
        if (lowerQuery.includes('thank')) {
            return reply(getRandomResponse('thanks'));
        }
        
        if (lowerQuery.includes('bye')) {
            return reply(getRandomResponse('bye'));
        }
        
        reply(`🤖 AI Response:\n\n"${query}"\n\n✨ I'm a simple AI. For advanced features, connect me to an AI service like OpenAI or Claude!`);
    },

    chat: async (sock, m, args, reply) => {
        const message = args.join(' ');
        if (!message) return reply('💬 Usage: .chat <message>\n\nExample: .chat How are you?');
        
        // Simple chat responses
        const responses = [
            `Interesting thought! Tell me more about "${message}"`,
            `I see what you mean. That's a great point!`,
            `${message}... That's fascinating!`,
            `Thanks for sharing! I appreciate your perspective.`
        ];
        
        reply(responses[Math.floor(Math.random() * responses.length)]);
    },

    smartreply: async (sock, m, args, reply) => {
        const sender = m.key.remoteJid;
        const groupData = getGroupData(sender);
        
        if (args[0] === 'on') {
            updateGroupData(sender, { smartreply: true });
            return reply('✅ Smart Reply enabled! I\'ll provide intelligent suggestions.');
        } else if (args[0] === 'off') {
            updateGroupData(sender, { smartreply: false });
            return reply('❌ Smart Reply disabled!');
        } else {
            return reply(`Smart Reply is currently: ${groupData.smartreply ? '✅ ON' : '❌ OFF'}\n\nUsage: .smartreply on/off`);
        }
    },

    aisummary: async (sock, m, args, reply) => {
        if (!m.message.extendedTextMessage?.contextInfo?.quotedMessage) {
            return reply('❌ Please reply to a message to summarize it!\n\nUsage: Reply to any message with .aisummary');
        }
        
        const quotedMsg = m.message.extendedTextMessage.contextInfo.quotedMessage;
        const text = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || 'No text found';
        
        const words = text.split(' ');
        const summary = words.length > 10 ? words.slice(0, 10).join(' ') + '...' : text;
        
        reply(`📝 *Message Summary:*\n\n${summary}\n\n📊 Original length: ${words.length} words\n📉 Summary length: ${summary.split(' ').length} words`);
    },

    sentiment: async (sock, m, args, reply) => {
        const text = args.join(' ');
        
        if (!text) {
            if (!m.message.extendedTextMessage?.contextInfo?.quotedMessage) {
                return reply('❌ Usage: .sentiment <text>\n\nOr reply to a message with .sentiment');
            }
            
            const quotedMsg = m.message.extendedTextMessage.contextInfo.quotedMessage;
            const quotedText = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || '';
            const sentiment = await analyzeSentiment(quotedText);
            return reply(`🎭 *Sentiment Analysis:*\n\n"${quotedText.substring(0, 100)}..."\n\n📊 Result: ${sentiment}`);
        }
        
        const sentiment = await analyzeSentiment(text);
        reply(`🎭 *Sentiment Analysis:*\n\n"${text}"\n\n📊 Result: ${sentiment}`);
    },

    mood: async (sock, m, args, reply) => {
        const moods = [
            '😊 Happy and energetic!',
            '😌 Calm and peaceful',
            '🤔 Thoughtful and contemplative',
            '😎 Cool and confident',
            '🤗 Warm and friendly',
            '💪 Motivated and determined',
            '😴 Relaxed and chill'
        ];
        
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        reply(`🎭 *Current Mood Detected:*\n\n${randomMood}\n\n✨ How are you feeling today?`);
    }
};
