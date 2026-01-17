// commands/image.js

module.exports = {
    image: async (sock, m, args, reply) => {
        const query = args.join(' ');
        if (!query) return reply('❌ Usage: .image <query>\n\nExample: .image sunset beach');
        reply(`🔍 Searching for: "${query}"\n\n⚠️ Image search requires API integration (Google Images, Unsplash, etc.)`);
    },

    pinterest: async (sock, m, args, reply) => {
        const query = args.join(' ');
        if (!query) return reply('❌ Usage: .pinterest <query>\n\nExample: .pinterest aesthetic wallpaper');
        reply(`📌 Searching Pinterest for: "${query}"\n\n⚠️ Pinterest API integration required`);
    },

    wallpaper: async (sock, m, args, reply) => {
        const query = args.join(' ');
        if (!query) return reply('❌ Usage: .wallpaper <query>\n\nExample: .wallpaper dark anime');
        reply(`🖼️ Finding wallpapers: "${query}"\n\n⚠️ Wallpaper API integration required`);
    },

    animepic: async (sock, m, args, reply) => {
        const name = args.join(' ');
        if (!name) return reply('❌ Usage: .animepic <character name>\n\nExample: .animepic naruto');
        reply(`🎭 Searching anime pics for: "${name}"\n\n⚠️ Anime API integration required`);
    },

    aesthetic: async (sock, m, args, reply) => {
        const query = args.join(' ');
        if (!query) return reply('❌ Usage: .aesthetic <query>\n\nExample: .aesthetic purple sky');
        reply(`✨ Finding aesthetic images: "${query}"\n\n⚠️ API integration required`);
    },

    meme: async (sock, m, args, reply) => {
        reply(`😂 Generating random meme...\n\n⚠️ Meme API integration required (Reddit, Imgflip, etc.)`);
    },

    avatar: async (sock, m, args, reply) => {
        reply(`👤 Getting avatar...\n\n⚠️ Avatar generation API required`);
    },

    randompic: async (sock, m, args, reply) => {
        reply(`🎲 Getting random picture...\n\n⚠️ Random image API required`);
    },

    sticker: async (sock, m, args, reply) => {
        if (!m.message.imageMessage && !m.message.videoMessage) {
            return reply('❌ Please reply to an image or video!\n\nUsage: Reply to media with .sticker');
        }
        reply(`🎨 Converting to sticker...\n\n⚠️ Sticker conversion requires Sharp/Jimp library`);
    },

    s: async (sock, m, args, reply) => {
        module.exports.sticker(sock, m, args, reply);
    },

    take: async (sock, m, args, reply) => {
        if (!m.message.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage) {
            return reply('❌ Reply to a sticker!\n\nUsage: .take <name>, <author>');
        }
        const text = args.join(' ');
        if (!text.includes(',')) {
            return reply('❌ Usage: .take <name>, <author>\n\nExample: .take Kumoko, Kynx');
        }
        const [name, author] = text.split(',').map(s => s.trim());
        reply(`✏️ Renaming sticker to:\nName: ${name}\nAuthor: ${author}\n\n⚠️ Sticker manipulation requires library`);
    },

    rename: async (sock, m, args, reply) => {
        module.exports.take(sock, m, args, reply);
    },

    circle: async (sock, m, args, reply) => {
        if (!m.message.imageMessage) {
            return reply('❌ Please reply to an image!\n\nUsage: Reply to image with .circle');
        }
        reply(`⭕ Making image circular...\n\n⚠️ Image manipulation requires Sharp library`);
    },

    crop: async (sock, m, args, reply) => {
        if (!m.message.imageMessage) {
            return reply('❌ Please reply to an image!\n\nUsage: Reply to image with .crop');
        }
        reply(`✂️ Cropping image...\n\n⚠️ Image manipulation requires Sharp library`);
    },

    resize: async (sock, m, args, reply) => {
        if (!m.message.imageMessage) {
            return reply('❌ Please reply to an image!\n\nUsage: .resize <pixels>');
        }
        const size = parseInt(args[0]);
        if (!size || size < 50 || size > 2000) {
            return reply('❌ Usage: .resize <pixels>\n\nExample: .resize 512\nRange: 50-2000');
        }
        reply(`📏 Resizing image to ${size}x${size}...\n\n⚠️ Image manipulation requires Sharp library`);
    },

    toimg: async (sock, m, args, reply) => {
        if (!m.message.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage) {
            return reply('❌ Reply to a sticker!\n\nUsage: Reply to sticker with .toimg');
        }
        reply(`🖼️ Converting sticker to image...\n\n⚠️ Sticker conversion requires library`);
    },

    steal: async (sock, m, args, reply) => {
        if (!m.message.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage) {
            return reply('❌ Reply to a sticker!\n\nUsage: Reply to sticker with .steal');
        }
        reply(`🎭 Stealing sticker...\n\n⚠️ This will convert and resend the sticker`);
    }
};