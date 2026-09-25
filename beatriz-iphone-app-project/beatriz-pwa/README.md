# 🎓 Beatriz - FREE Spanish Learning iPhone App

**Learn Spanish with Beatriz using the Language Transfer method - completely free!**

## 💰 Cost: $0/month

This FREE version uses:
- ✅ **Web Speech API** (built into Safari on iPhone)
- ✅ **Groq API** (free tier: 14,400 requests/day)
- ✅ **Free hosting** (Render.com free tier)

**No subscriptions. No credit card. No hidden costs.**

---

## 🚀 Quick Start

### For Users (Non-Technical)

**Just want to use the app?**

👉 Read: [`FREE-VERSION-SETUP.md`](./FREE-VERSION-SETUP.md)

This guide walks you through:
1. Getting a free Groq API key (5 min)
2. Deploying to Render.com (10 min)
3. Installing on your iPhone (5 min)

**Total time:** 20 minutes from zero to working app!

---

### For Developers

**Want to run locally or customize?**

#### 1. Clone the Repository

```bash
git clone https://github.com/johanrobinson/beatriz-iphone-app.git
cd beatriz-iphone-app/beatriz-iphone-app-project/beatriz-pwa
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Get Groq API Key

1. Sign up at: https://console.groq.com (free, no credit card)
2. Create API key: https://console.groq.com/keys
3. Copy the key (starts with `gsk_...`)

#### 4. Configure Environment

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your Groq API key
# GROQ_API_KEY=gsk_your_actual_key_here
```

#### 5. Run Locally

```bash
npm start
```

Open: http://localhost:3000

#### 6. Test on iPhone (Local Network)

1. Find your computer's IP address:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. On iPhone (connected to same WiFi), open Safari
3. Go to: `http://YOUR_IP_ADDRESS:3000`
4. Tap Share → Add to Home Screen

**Note:** Microphone requires HTTPS in production. Use Render/Railway for that.

---

## 🏗️ Architecture

### How It Works

```
┌─────────────────────────────────┐
│  iPhone (Safari)                │
│  ┌─────────────────────────┐   │
│  │ Web Speech API          │   │ ← FREE (built-in)
│  │ - Recognition (speech→text) │
│  │ - Synthesis (text→speech)   │
│  └─────────────┬───────────┘   │
│                ↓                 │
│  ┌─────────────────────────┐   │
│  │ JavaScript (app.js)     │   │
│  │ - Conversation logic    │   │
│  │ - Voice control         │   │
│  └─────────────┬───────────┘   │
└────────────────┼─────────────────┘
                 ↓ HTTPS
         ┌───────────────┐
         │ Node.js Server│
         │ (server.js)   │
         └───────┬───────┘
                 ↓ API Call
         ┌───────────────┐
         │ Groq API      │ ← FREE tier
         │ Llama 3.1 70B │
         └───────────────┘
```

### Tech Stack

- **Frontend:** Vanilla JavaScript (no framework)
- **Backend:** Node.js + Express
- **AI:** Groq API (Llama 3.1 70B Versatile)
- **Voice:** Web Speech API (native browser API)
- **Hosting:** Render.com / Railway.app / Fly.io
- **Type:** Progressive Web App (PWA)

---

## 📁 Project Structure

```
beatriz-pwa/
├── server.js                 # Node.js backend (Groq API proxy)
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── README.md                 # This file
├── FREE-VERSION-SETUP.md     # User setup guide
└── public/
    ├── index.html            # Main app UI (FaceTime-like)
    ├── install.html          # Installation instructions
    ├── app.js                # Frontend logic (Web Speech + API)
    ├── style.css             # Styling
    ├── sw.js                 # Service worker (PWA, offline)
    ├── manifest.webmanifest  # PWA manifest
    └── assets/
        ├── beatriz-icon.png  # App icon
        └── beatriz-avatar.png # Beatriz avatar image
```

---

## 🎨 Features

### Current Features

✅ **FaceTime-like UI** - Professional video call interface
✅ **Voice conversation** - Speak Spanish, get responses
✅ **Language Transfer method** - Socratic teaching style
✅ **Web Speech API** - Free, built-in voice recognition
✅ **Spanish voices** - Multiple native Spanish voices
✅ **PWA** - Install as app on iPhone home screen
✅ **Offline-ready** - Service worker caching
✅ **Free hosting** - Deploy to Render/Railway
✅ **No costs** - $0/month forever

### Teaching Method (Language Transfer)

Beatriz teaches using the proven **"Thinking Method"**:

1. **Build, don't memorize** - Construct sentences using logic
2. **Socratic questions** - Guide you to discover answers
3. **Pattern recognition** - Learn structures, not individual words
4. **Slow and clear** - Patient repetition
5. **Gentle corrections** - Immediate but kind feedback
6. **Connection to English** - Show Latin roots and similarities

### Example Conversation

```
Beatriz: "Hola Johan, ¿qué tal estás hoy?"

You: "Estoy bien, gracias"

Beatriz: "Muy bien! Ahora, ¿recuerdas cómo decir 'I want to speak'?
          Piensa... 'quiero' es 'I want'..."

You: "Quiero hablar"

Beatriz: "¡Perfecto! Ahora intenta: 'I want to learn Spanish'"
```

---

## 🔧 Customization

### Modify Beatriz's Teaching Style

Edit `server.js`, line 33: `BEATRIZ_SYSTEM_PROMPT`

```javascript
const BEATRIZ_SYSTEM_PROMPT = `
Eres Beatriz, una profesora de español...
// Customize personality, teaching method, etc.
`;
```

### Change Voice Settings

Edit `app.js`, line 50:

```javascript
utterance.rate = 0.85;  // Speech speed (0.1 to 2.0)
utterance.pitch = 1.0;  // Voice pitch (0 to 2)
utterance.volume = 1.0; // Volume (0 to 1)
```

### Use Different LLM Model

Edit `server.js`, line 121:

```javascript
model: 'llama-3.1-70b-versatile', // Try: llama-3.1-8b-instant (faster)
```

Available Groq models:
- `llama-3.1-70b-versatile` - Best quality (recommended)
- `llama-3.1-8b-instant` - Faster, lower quality
- `mixtral-8x7b-32768` - Alternative option

---

## 📊 Free Tier Limits

### Groq API (FREE)

- ✅ **14,400 requests per day** (per model)
- ✅ **30 requests per minute**
- ✅ **No credit card required**
- ✅ **Llama 3.1 70B** - High quality

**What this means:**
- ~240 conversations/day (60 requests each)
- ~2-3 hours of practice/day
- More than enough for daily learning!

### Render.com (FREE)

- ✅ **750 hours/month** free
- ✅ **HTTPS included**
- ✅ **512 MB RAM**
- ✅ **Auto-deploy from GitHub**

**Limitations:**
- Spins down after 15 min inactivity (first request slower)
- Max 750 hours/month (but that's 24/7 coverage)

---

## 🆚 Comparison: Free vs Paid

| Feature | FREE Version | Paid (OpenAI Realtime) |
|---------|--------------|------------------------|
| **Voice quality** | Good (Web Speech) | Excellent (very natural) |
| **Response speed** | 1-2 seconds | Instant |
| **Conversation quality** | Excellent (Llama 3.1) | Excellent (GPT-4o) |
| **Cost per month** | **$0** | **$5-50+** |
| **Daily practice limit** | ~240 conversations | Unlimited (if you pay) |
| **Setup complexity** | Easy | Easy |
| **Best for** | Daily learners | Heavy users |

**Recommendation:** Start with FREE, upgrade only if needed.

---

## 🐛 Troubleshooting

### "Tu navegador no soporta reconocimiento de voz"

**Problem:** Browser doesn't support Web Speech API

**Solution:**
- ✅ Use Safari on iPhone (not Chrome)
- ✅ Make sure you're on iOS 14.3+

### Beatriz doesn't respond

**Problem:** Groq API not configured

**Solution:**
1. Check `.env` file has `GROQ_API_KEY=gsk_...`
2. Verify key at: https://console.groq.com/keys
3. Check Render environment variables

### "Tillåt mikrofon-åtkomst"

**Problem:** Microphone permission denied

**Solution:**
- iPhone Settings → Safari → Microphone → Allow for your site
- Or try reloading the page and allow when prompted

### Voice sounds robotic

**Not a problem!** Web Speech API uses built-in iOS voices. They're functional but not as natural as paid options.

**Solution:** If you want better voices, consider upgrading to OpenAI Realtime API (costs money).

### App won't install on home screen

**Problem:** Not using Safari or wrong steps

**Solution:**
1. Must use Safari (not Chrome)
2. Tap Share button (square with arrow up)
3. Scroll down to "Add to Home Screen"

---

## 🚀 Deployment

### Render.com (Recommended)

See [`FREE-VERSION-SETUP.md`](./FREE-VERSION-SETUP.md) for detailed instructions.

**Quick steps:**
1. Push code to GitHub
2. Connect GitHub to Render
3. Set `GROQ_API_KEY` environment variable
4. Deploy!

### Railway.app

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Fly.io

```bash
# Install flyctl
brew install flyctl

# Login
flyctl auth login

# Deploy
flyctl launch
```

---

## 📚 Resources

### Language Transfer

- **Official site:** https://www.languagetransfer.org
- **Spanish course:** https://downloads.languagetransfer.org/spanish/spanish.zip
- **Method:** "The Thinking Method" - build, don't memorize

### APIs Used

- **Groq API:** https://console.groq.com
- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

### Hosting

- **Render:** https://render.com
- **Railway:** https://railway.app
- **Fly.io:** https://fly.io

---

## 📝 License

This is a personal project. Feel free to fork and modify for your own use.

---

## 🙏 Credits

- **Language Transfer** - Teaching methodology
- **Groq** - Free LLM API
- **Web Speech API** - Browser voice capabilities
- **ChatGPT** - Initial project structure (modified for free version)

---

## 💬 Support

Questions? Issues?

1. Check [`FREE-VERSION-SETUP.md`](./FREE-VERSION-SETUP.md)
2. Review this README
3. Check Render/Railway logs
4. Test Groq API at: https://console.groq.com/playground

---

**¡Buena suerte con tu español! 🇪🇸**
