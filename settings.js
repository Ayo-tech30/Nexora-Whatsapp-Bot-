// settings.js

module.exports = {
  // Bot Information
  botName: 'Nexora Bot',
  botNumber: '2249049460676', // Your bot's WhatsApp number (with country code, no +)
  ownerNumber: '2349049460676', // Owner number(s) - array format
  ownerName: 'Owner',
  
  // Bot Settings
  prefix: '!', // Command prefix (e.g., !help, !menu)
  sessionName: 'nexora-session', // Session file name
  autoRead: false, // Auto-read messages
  autoTyping: false, // Show typing indicator
  alwaysOnline: true, // Always show as online
  
  // Group Settings
  antilink: false, // Anti-link protection in groups
  welcome: true, // Welcome new members
  goodbye: true, // Goodbye message when members leave
  
  // Features
  publicMode: true, // false = only owner can use, true = everyone can use
  selfMode: false, // true = bot only responds to itself
  
  // API Keys (if you're using any)
  apiKeys: {
    openai: process.env.OPENAI_API_KEY || '',
    weather: process.env.WEATHER_API_KEY || '',
    // Add more as needed
  },
  
  // Messages
  messages: {
    ownerOnly: '❌ This command is only for the bot owner!',
    groupOnly: '❌ This command can only be used in groups!',
    privateOnly: '❌ This command can only be used in private chat!',
    botAdmin: '❌ Bot must be an admin to use this command!',
    userAdmin: '❌ You must be an admin to use this command!',
    waiting: '⏳ Processing...',
    error: '❌ An error occurred!',
  },
  
  // Limits
  limits: {
    maxCommands: 20, // Max commands per user per minute
    maxFileSize: 50, // Max file size in MB
  },
  
  // Database (optional)
  database: {
    mongoUrl: process.env.MONGO_URL || '',
  },
  
  // Web Server (for Render deployment)
  port: process.env.PORT || 3000,
  
  // Timezone
  timezone: 'Africa/Lagos', // Change to your timezone
  
  // Social Links
  social: {
    telegram: 'https://t.me/nexora_telegram_channel',
    github: 'https://github.com/yourusername',
    website: 'https://kumokospider.vecel.app',
  }
};
