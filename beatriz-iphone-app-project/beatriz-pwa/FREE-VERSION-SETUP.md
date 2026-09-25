# 🎉 Beatriz FREE Version - Setup Guide

**Cost: $0/month forever** ✅

This version uses:
- **Web Speech API** (built into Safari) - FREE
- **Groq API** (Llama 3.1 70B) - FREE tier
- **Render/Railway hosting** - FREE tier

---

## Step 1: Get Free Groq API Key (5 minutes)

### 1.1 Create Groq Account

1. Go to: https://console.groq.com
2. Click **"Sign Up"** (top right)
3. Sign up with:
   - Google account, OR
   - GitHub account, OR
   - Email + password
4. **No credit card required!** ✅

### 1.2 Create API Key

1. Once logged in, go to: https://console.groq.com/keys
2. Click **"Create API Key"**
3. Name it: `Beatriz iPhone App`
4. Click **"Submit"**
5. **COPY the API key** - it looks like: `gsk_...` (you'll only see it once!)
6. Save it somewhere safe (e.g., Notes app)

### 1.3 Groq Free Tier Limits

✅ **14,400 requests per day** (per model)
✅ **30 requests per minute**
✅ **No credit card required**
✅ **No expiration**

**What this means:** You can have ~240 conversations per day (assuming 60 requests per conversation). Perfect for daily practice!

---

## Step 2: Deploy to Render.com (10 minutes)

### 2.1 Create Render Account

1. Go to: https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub (easiest)
4. **Free tier: 750 hours/month** ✅

### 2.2 Connect GitHub Repository

1. Make sure your code is on GitHub: `johanrobinson/beatriz-iphone-app`
2. In Render dashboard, click **"New +"** → **"Web Service"**
3. Click **"Connect account"** to link GitHub
4. Find and select: `johanrobinson/beatriz-iphone-app`
5. Click **"Connect"**

### 2.3 Configure Web Service

**Settings to configure:**

| Field | Value |
|-------|-------|
| **Name** | `beatriz-app` (or any name you like) |
| **Region** | Choose closest to you (e.g., Frankfurt for Europe) |
| **Branch** | `main` |
| **Root Directory** | `beatriz-iphone-app-project/beatriz-pwa` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** ✅ |

### 2.4 Add Environment Variable

1. Scroll down to **"Environment Variables"**
2. Click **"Add Environment Variable"**
3. Add:
   - **Key:** `GROQ_API_KEY`
   - **Value:** `gsk_...` (paste your Groq API key from Step 1)
4. Click **"Add"**

### 2.5 Deploy!

1. Click **"Create Web Service"** at the bottom
2. Wait 2-3 minutes while Render builds and deploys
3. You'll see a URL like: `https://beatriz-app.onrender.com`
4. **Save this URL!** This is your app's address

---

## Step 3: Install on iPhone (5 minutes)

### 3.1 Open in Safari

1. **On your iPhone**, open Safari
2. Go to: `https://beatriz-app.onrender.com` (your Render URL)
3. Wait for the page to load

### 3.2 Add to Home Screen

1. Tap the **Share button** (square with arrow pointing up)
2. Scroll down and tap **"Add to Home Screen"**
3. Name it: `Beatriz`
4. Tap **"Add"** (top right)
5. You'll see the Beatriz icon on your home screen! 🎉

### 3.3 Alternative: Use Install Page

1. Go to: `https://beatriz-app.onrender.com/install.html`
2. Follow the instructions on that page
3. Or download the `.mobileconfig` profile

---

## Step 4: Test the App (2 minutes)

### 4.1 Launch Beatriz

1. Tap the **Beatriz icon** on your iPhone home screen
2. It should open full-screen (no Safari UI)
3. You'll see the FaceTime-like interface

### 4.2 Start a Conversation

1. Tap **"Starta samtal"** (Start call)
2. Allow microphone access when prompted
3. Wait ~2 seconds for Beatriz to greet you
4. She'll say: *"Hola Johan, soy Beatriz. ¿Qué tal estás hoy?"*
5. **Respond in Spanish!** Try: *"Hola Beatriz, estoy bien, gracias"*
6. Have a conversation! 🎉

---

## 🎯 Usage Tips

### Best Practices

✅ **Speak clearly** - The Web Speech API works best with clear pronunciation
✅ **Wait for Beatriz to finish** - Let her complete speaking before you respond
✅ **Use Safari** - Chrome on iOS doesn't support Web Speech API well
✅ **Good internet** - Needs connection for Groq API (voice works offline after synthesis loads)

### If Something Goes Wrong

**Problem:** "Tu navegador no soporta reconocimiento de voz"
- **Solution:** Make sure you're using Safari on iPhone (not Chrome)

**Problem:** Beatriz doesn't respond
- **Solution:** Check that GROQ_API_KEY is set correctly in Render

**Problem:** "Tillåt mikrofon-åtkomst"
- **Solution:** Go to iPhone Settings → Safari → Microphone → Allow for this site

**Problem:** Speech sounds robotic
- **Solution:** This is normal for Web Speech API. It's free! 😊

---

## 💰 Cost Breakdown

| Service | Free Tier | Your Cost |
|---------|-----------|-----------|
| **Groq API** | 14,400 req/day | **$0** |
| **Web Speech API** | Built into Safari | **$0** |
| **Render Hosting** | 750 hours/month | **$0** |
| **Domain** | .onrender.com subdomain | **$0** |
| **Total** | | **$0/month** ✅ |

---

## 🚀 Next Steps

Once it's working, you can:

1. **Practice daily** - Build a habit with Beatriz
2. **Track progress** - Note what you've learned
3. **Upgrade later** - If you want better voices, consider paid OpenAI Realtime API
4. **Customize** - Modify the teaching style in `server.js`

---

## 📞 Support

If you run into issues:

1. Check the **Render logs** (in Render dashboard → Logs)
2. Make sure GROQ_API_KEY is set correctly
3. Test the Groq API key at: https://console.groq.com/playground
4. Verify your iPhone is using Safari (not Chrome)

---

## 🎓 Language Transfer Resources

Want to supplement Beatriz with the original course?

- **Download:** https://downloads.languagetransfer.org/spanish/spanish.zip
- **Website:** https://www.languagetransfer.org
- **Method:** "The Thinking Method" - build, don't memorize

---

**You're all set! Enjoy learning Spanish with Beatriz - completely free!** 🇪🇸

---

## Appendix: Alternative Hosting Options

### Railway.app

- **Free tier:** $5 credit/month
- **Setup:** Similar to Render
- **URL:** https://railway.app

### Fly.io

- **Free tier:** 3 shared VMs
- **Slightly more technical**
- **URL:** https://fly.io

### Vercel

- **Free tier:** Unlimited
- **Good for static + serverless**
- **URL:** https://vercel.com
