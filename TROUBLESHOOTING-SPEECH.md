# 🔊 Troubleshooting Speech Issues on iPhone

If you can see Beatriz's responses in text but can't hear her speak, try these fixes:

## ✅ Quick Fixes (Try These First)

### 1. Check iPhone Volume
- **Press volume UP button** on the side of your iPhone
- Make sure ringer switch is NOT on silent (orange showing = silent)
- Volume needs to be at least 50% to hear clearly

### 2. Check Safari Audio Settings
- While in the app, tap the **"aA" button** in Safari's address bar
- Make sure **"Website Settings"** shows audio is allowed
- Or go to: iPhone Settings → Safari → Auto-Play → Allow All Auto-Play

### 3. Restart the Call
- Tap **"Avsluta"** (End call)
- Close Safari completely (swipe up from app switcher)
- Reopen the app
- Tap **"Starta samtal"** again

### 4. Check Safari's Developer Console
- On Mac: Safari → Develop → [Your iPhone] → Select the Beatriz page
- Look for errors like "Speech synthesis error"
- Look for console logs: "Speaking:", "Speech started", etc.

---

## 🐛 Debug Mode

To see what's happening with speech:

1. Open the app on your iPhone
2. On your Mac: Safari → Develop → [iPhone Name] → Beatriz app
3. You'll see console logs like:
   ```
   Available voices: [...]
   Selected voice: Monica (es-ES)
   Speaking: Hola Johan...
   Starting speech synthesis...
   Speech started
   Speech ended
   ```

If you see "Speech started" but no sound:
- Volume is too low
- Silent mode is ON
- Audio output is going to AirPods/Bluetooth (check!)

---

## 🎧 Common Issues

### "Speech started" but no sound

**Problem:** Audio is muted or going to wrong output

**Solutions:**
1. Check volume is UP
2. Disconnect AirPods/Bluetooth headphones
3. Make sure ringer switch is OFF (no orange showing)
4. Try playing a YouTube video - if that works, speech should too

### No console logs at all

**Problem:** JavaScript isn't running

**Solutions:**
1. Hard refresh: Hold ⌘+Shift+R (on Mac Safari)
2. Clear cache: Safari → Develop → Empty Caches
3. Force quit Safari and reopen

### "Speech synthesis error"

**Problem:** iOS denied speech synthesis

**Solutions:**
1. Check Settings → Safari → Advanced → Experimental Features
2. Make sure "Web Speech API" is enabled
3. Try in a different browser tab
4. Restart iPhone

---

## 🔍 iOS Safari Quirks

### Known iOS Behaviors:

1. **First speech might be silent**
   - iOS sometimes needs a "warm up"
   - If first greeting is silent, speak to Beatriz
   - Her response should have audio

2. **Auto-play blocked**
   - Some iOS versions block auto-playing audio
   - Settings → Safari → Auto-Play → Allow All Auto-Play

3. **Voices not loaded**
   - iOS loads voices asynchronously
   - The app now waits for voices to load
   - If still silent, restart the call

---

## 🧪 Test Speech Manually

Want to test if speech works at all on your iPhone?

1. Open Safari on iPhone
2. Go to: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
3. Find the speech synthesis demo
4. Tap "Speak"
5. If you hear it, speech works - issue is in our app
6. If you don't hear it, iOS speech is disabled

---

## ✅ What SHOULD Happen

When everything works correctly:

1. Tap "Starta samtal"
2. Console shows: "Voices initialized"
3. You see: "Beatriz: Hola Johan..."
4. Console shows: "Speaking: Hola Johan..."
5. Console shows: "Speech started"
6. **You HEAR Beatriz speaking** 🔊
7. Console shows: "Speech ended"

---

## 🚀 Still Not Working?

After trying all above, if still no sound:

1. **Update to latest code** (redeploy on Render)
2. **Check Render logs** for any server errors
3. **Try on a different iPhone** (to rule out device issue)
4. **Use Chrome on Android** (different browser, different OS)

---

## 📱 iOS Version Requirements

Web Speech API requires:
- **iOS 14.3+** for Speech Synthesis
- **iOS 14.5+** for best compatibility
- **Safari only** (Chrome on iOS doesn't support it well)

Check: Settings → General → About → iOS Version

---

## 💡 Pro Tips

### Make Speech More Reliable:

1. **Don't interrupt Beatriz** - Let her finish speaking
2. **Wait 1-2 seconds** after she finishes before speaking
3. **Keep volume at 60%+** for clear audio
4. **Use WiFi** not cellular (faster, more reliable)
5. **Close other apps** that might use audio

### If Speech Cuts Out:

- Beatriz might be paused mid-sentence
- App includes auto-resume after 100ms
- If it keeps happening, reduce response length in server.js:
  ```javascript
  max_tokens: 100 // Was 150, try shorter
  ```

---

## 🎤 Microphone vs Speaker

**Two separate systems:**

1. **Microphone (Your voice)** = Speech Recognition
   - Needs microphone permission
   - Shows "Lyssnar" when active
   - Displays "Tú: [your words]"

2. **Speaker (Beatriz's voice)** = Speech Synthesis
   - Needs volume turned up
   - Shows "Beatriz pratar" when active
   - Displays "Beatriz: [her words]"

Both can work independently. If you see both working in text but no sound, it's a speaker/volume issue.

---

**Still stuck? The latest code includes extensive console logging. Check Safari's developer console to see exactly where speech fails!**
