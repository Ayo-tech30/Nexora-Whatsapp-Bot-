🤖 AYANOKOJI - Advanced WhatsApp Bot
�

╭━━ ✦彡  𝚴𝚵𝚾𝚯𝚪𝚫  彡✦ ━━╮     
║  ✧ Name: Ayanokoji 
║  ✧ Prefix  : .   
║  ✧ Creator : Kynx
╰━━━━━━━━━━━━━━━━━━╯
�
�
�
�
Load image
Load image
The most advanced WhatsApp group management bot with hierarchical moderation, economy system, and AI capabilities.
Features • Quick Start • Commands • Deployment • Mod System
�

✨ Features
🛡️ Advanced Moderation System
Hierarchical permission levels (Member → Mod → Guardian → Owner → Creator)
Kick, ban, warn, and mute functionality
3-strike warning system with auto-kick
Shadow mute (invisible to target)
Complete audit trail logging
Temporary admin roles
🔒 Security & Anti-Raid
Anti-link protection (auto-kick)
Anti-spam & anti-flood detection
Anti-bot measures
Raid mode (emergency lockdown)
Ban list management
Auto-kick banned users on rejoin
💰 Complete Economy System
Virtual currency with banking
Daily & weekly rewards ($500-1000 daily)
Work system (earn $400-700/hour)
Crime mechanics (high risk, high reward)
Steal from other users
Pay & receive money
XP & leveling system
Global leaderboards
Shop & inventory
🎮 Fun & Entertainment
Random jokes & inspirational quotes
Truth or dare generator
Ship calculator (compatibility)
Rizz/pickup lines
Poll creation system
Interactive games
⚙️ Group Management
Add/remove members
Lock/unlock group messages
Tag all members
Hide tag (ghost mention)
Custom rules system
Welcome/leave messages
Slowmode controls
Message clearing
📊 Statistics & Monitoring
Bot uptime & performance stats
Group activity tracking
Ping/latency checker
Permission level viewer
Admin list display
Memory usage monitoring
🧠 AI Integration Ready
AI chat assistant (API required)
Smart reply system
Sentiment analysis
Mood detection
Auto-summarization
🎴 Card System (Coming Soon)
Collectible anime cards
Trading marketplace
Card battles
Deck building
🚀 Quick Start
Prerequisites
✓ Node.js 18 or higher
✓ WhatsApp account (with phone number)
✓ Internet connection
Installation (5 Minutes)
Method 1: Local Setup
# 1. Clone repository
git clone https://github.com/yourusername/ayanokoji-bot.git
cd ayanokoji-bot

# 2. Install dependencies
npm install

# 3. Set phone number for pairing
export PHONE_NUMBER=2349049460676  # Your WhatsApp number (no + sign)

# 4. Start bot
node bot.js

# 5. Scan pairing code
# Bot will display an 8-digit code
# Open WhatsApp → Settings → Linked Devices → Link a Device
# Tap "Link with phone number instead" → Enter the code
Method 2: Deploy to Cloud (Render.com)
# 1. Push code to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to render.com → New Web Service
# 3. Connect your GitHub repo
# 4. Add environment variable:
#    PHONE_NUMBER = 2349049460676
# 5. Deploy
# 6. Check logs for pairing code
🎯 First Time Setup
After bot connects to WhatsApp:
Step 1: Set yourself as owner
.setowner @yourNumber

Step 2: Add trusted guardians
.addguardian @trustedUser

Step 3: Add moderators
.addmod @moderatorUser
.addmod @anotherMod

Step 4: Configure security
.antilink on
.antispam on
.antiflood on

Step 5: Set group rules
.setrules Be respectful, no spam, no NSFW content

Step 6: Check setup
.mods
.permissions
📖 Command Reference
🧠 AI & Smart Tools
.ai [query]              - Ask AI a question
.chat [message]          - Chat with AI bot
.smartreply on/off       - Toggle smart auto-replies (Mod+)
.sentiment [text]        - Analyze sentiment of text
.mood                    - Display current mood
⚔️ Group Control
.add [number]            - Add member to group (Mod+)
.kick @user              - Remove member from group (Mod+)
.lock                    - Lock group (admins only can message) (Mod+)
.unlock                  - Unlock group (Mod+)
.tagall                  - Mention all group members (Mod+)
.hidetag [text]          - Hidden mention everyone (Mod+)
.setrules [text]         - Set/update group rules (Mod+)
.rules                   - Display group rules
.clear [number]          - Clear messages (Mod+)
👑 Creator Authority (Kynx Only)
.promote @user           - Promote to WhatsApp admin
.demote @user            - Demote from WhatsApp admin
.tempadmin @user [time]  - Temporary admin role
.ban @user               - Permanently ban user
.tempban @user [time]    - Temporary ban
.unban @user             - Remove ban
.panic                   - Emergency group lock
.disable [command]       - Disable a command in group
.enable [command]        - Re-enable a command
.restart                 - Restart the bot
.setprefix [prefix]      - Change command prefix
.mode public/private     - Set bot access mode
⚙️ Core Commands
.mods                    - View complete mod team hierarchy
.adminlist               - List all WhatsApp admins
.adminrank               - Check your permission rank
.banlist                 - View banned users (Mod+)
.forceleave              - Make bot leave group (Creator)
.audittrail              - View mod action logs (Guardian+)
.modlog                  - Same as audittrail (Guardian+)
🛡️ Moderation
.mute @user              - Mute user (auto-delete messages) (Mod+)
.unmute @user            - Unmute user (Mod+)
.warn @user [reason]     - Issue warning (3 = kick) (Mod+)
.warnings @user          - Check user's warnings
.resetwarn @user         - Reset warnings (Mod+)
.slowmode [seconds]      - Set message cooldown (Mod+)
.note [text]             - Save a note (Mod+)
.report @user [reason]   - Report user to mods
🛡️ Security & Anti-Raid
.antilink on/off         - Toggle anti-link protection (Mod+)
.antispam on/off         - Toggle anti-spam detection (Mod+)
.antiflood on/off        - Toggle anti-flood protection (Mod+)
.antibot on/off          - Toggle anti-bot measures (Mod+)
.verify                  - Verification system
.shadowmute @user        - Invisible mute (Guardian+)
.raidmode on/off         - Emergency raid protection (Guardian+)
💰 Economy & Levels
.balance / .bank         - Check your balance
.daily                   - Claim daily reward ($500-1000) [24h cooldown]
.weekly                  - Claim weekly reward ($3500-5000) [7d cooldown]
.work                    - Work for money ($400-700) [1h cooldown]
.crime                   - Attempt crime (high risk/reward)
.pay @user [amount]      - Send money to user
.steal @user             - Attempt to steal money (30% success)
.level / .rank           - Check your level & XP
.leaderboard             - View top 10 richest users
.shop                    - View items for sale
.inventory               - Check your items
🎮 Fun & Social
.joke                    - Random joke
.quote                   - Inspirational quote
.truth                   - Truth question
.dare                    - Dare challenge
.ship @user1 @user2      - Calculate compatibility
.rizz                    - Get a pickup line
.poll [q|opt1|opt2]      - Create a poll
🎴 Card System (Under Development)
.cards                   - View your card collection
.cardshop                - Browse card packs
.buypack [type]          - Buy card pack
🚧 More features coming soon!
📊 Stats & Info
.ping                    - Check bot latency
.stats                   - View bot statistics
.activity                - Group activity data
.permissions             - View permission levels
.creator                 - Contact bot creator
🛡️ Mod System Explained
Permission Hierarchy
⚡ CREATOR (Kynx)
    ↓
👑 OWNER (Set per group)
    ↓
🛡️ GUARDIANS (Senior staff)
    ↓
⚔️ MODERATORS (Staff)
    ↓
👥 MEMBERS
Permission Levels
Role
Can Use
Cannot Use
👥 Member
Basic commands, economy, fun
Any moderation
⚔️ Moderator
Kick, warn, mute, security features
Add/remove mods, ban
🛡️ Guardian
All mod commands + manage mods
Set owner, creator commands
👑 Owner
All guardian commands + manage guardians
Creator-only commands
⚡ Creator
ALL commands, full bot control
Nothing (full access)
Managing Your Team
# View current team
.mods

# Add moderator (Guardian+ required)
.addmod @username

# Add guardian (Owner required)
.addguardian @username

# Remove moderator
.removemod @username

# Remove guardian
.removeguardian @username

# Transfer ownership (Current owner or creator)
.setowner @newOwner
🚀 Deployment Options
Option 1: Render.com (Recommended - Free)
Push to GitHub
git init
git add .
git commit -m "Deploy Ayanokoji Bot"
git remote add origin your-repo-url
git push -u origin main
Deploy on Render
Go to render.com
New → Web Service
Connect GitHub repo
Settings:
Build Command: npm install
Start Command: node bot.js
Environment Variables:
PHONE_NUMBER = 2349049460676
NODE_ENV = production
Get Pairing Code
Check logs for 8-digit code
Enter in WhatsApp
Option 2: Railway.app
npm install -g @railway/cli
railway login
railway init
railway up
Option 3: Oracle Cloud (Free Forever)
Create Oracle Cloud account
Create Ubuntu 22.04 VM (ARM - 4 CPU, 24GB RAM free)
SSH into server
Run setup:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git
git clone your-repo
cd ayanokoji-bot
npm install
npm install -g pm2
export PHONE_NUMBER=2349049460676
pm2 start bot.js --name ayanokoji
pm2 save
pm2 startup
Option 4: Local 24/7
npm install -g pm2
export PHONE_NUMBER=2349049460676
pm2 start bot.js --name ayanokoji-bot
pm2 save
pm2 startup
⚙️ Configuration
Environment Variables
Variable
Description
Required
PHONE_NUMBER
Your WhatsApp number (no +)
✅ Yes
NODE_ENV
Environment (production/development)
❌ Optional
Bot Settings (In Code)
const PREFIX = '.';              // Command prefix
const BOT_NAME = 'Ayanokoji';    // Bot name
const CREATOR = 'Kynx';          // Creator name
const CREATOR_NUMBER = '2349049460676@c.us';  // Creator WhatsApp
Customization
Edit bot.js to customize:
Command prefix
Bot name
Welcome messages
Economy rewards
Cooldown times
Permission levels
🔧 Troubleshooting
Bot Not Starting
# Check Node.js version
node -v  # Should be 18+

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for errors
node bot.js
Pairing Code Not Showing
# Make sure PHONE_NUMBER is set
echo $PHONE_NUMBER

# Set it if missing
export PHONE_NUMBER=2349049460676

# Restart bot
node bot.js
Session Expired
# Delete old session
rm -rf .wwebjs_auth/

# Restart bot (new QR/pairing code will appear)
node bot.js
Commands Not Working
Check if command is disabled: .enable [command]
Check permissions: .adminrank
Check bot mode: .mode public
Verify bot is admin in group
Bot Disconnecting
# Use PM2 for auto-restart
pm2 start bot.js --name ayanokoji
pm2 logs ayanokoji
🤝 Contributing
We welcome contributions! Here's how:
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
Feature Requests
Open an issue with the label enhancement and describe:
What feature you want
Why it's useful
How it should work
📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
👨‍💻 Credits
Created by: Kynx
Contact: wa.me/2349049460676
Bot Name: Ayanokoji
Version: 3.0.0
Built With:
WhatsApp-Web.js - WhatsApp API
Node.js - Runtime
Axios - HTTP client
📞 Support
Need help? Multiple options:
💬 WhatsApp: wa.me/2349049460676
🐛 Bug Report: Open an issue on GitHub
💡 Feature Request: Open an issue with enhancement label
📧 Email: support@yourbot.com
🗺️ Roadmap
v3.1 (Coming Soon)
[ ] Complete AI integration
[ ] Advanced card battle system
[ ] Tournament system
[ ] Custom themes
[ ] Multi-language support
v3.2 (Planned)
[ ] Voice command support
[ ] Advanced analytics dashboard
[ ] Plugin system
[ ] Web panel for management
[ ] Auto-moderation AI
v4.0 (Future)
[ ] Multi-platform support (Telegram, Discord)
[ ] Blockchain integration
[ ] NFT cards
[ ] Advanced RPG system
⚠️ Disclaimer
This bot is for educational and entertainment purposes. By using this bot:
You agree to comply with WhatsApp's Terms of Service
You take full responsibility for the bot's actions
The creator (Kynx) is not responsible for misuse
Use at your own risk
Note: WhatsApp may ban accounts that violate their ToS. Use responsibly.
🌟 Star History
If you find this project useful, please give it a ⭐ on GitHub!
�

Made with ❤️ by Kynx
⬆ Back to Top
�
