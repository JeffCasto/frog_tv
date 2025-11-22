# FrogTV - OBS Setup (ACTUALLY WORKING VERSION)

## What I Just Fixed

### 1. Frog Layout ✅
**Changed:** Frogs now sit PROPERLY on the couch cushions instead of floating randomly
**File:** `/home/dev/frog_tv/web/src/pages/stage.tsx`

**New Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│     [Area for TinyTV overlay]      │ ← Top area (Y: 0-400)
│                                     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      🐸       🐸       🐸          │ ← Frogs (Y: ~760)
│   [=== BROWN COUCH ===]            │ ← Couch (Y: 840-1080)
│                                     │
└─────────────────────────────────────┘
```

**Frog Positions (1920x1080 canvas):**
- Frog 1 (Blue/Stoned): X: 680, Y: 760
- Frog 2 (Orange/Philosophical): X: 960, Y: 760 (center)
- Frog 3 (Green/Excited): X: 1240, Y: 760

### 2. Video Streaming 
**Current:** Using YouTube embed (rB1KkEgOeYc)
**Ready:** YouTube live embed is used for TinyTV

---

## Quick OBS Setup (Ubuntu)

### Scene 1: FrogStage
1. Sources → Add → **Browser**
2. Name: `FrogStage`
3. Settings:
   ```
   URL: http://localhost:3000/stage
   Width: 1920
   Height: 1080
   FPS: 30
   ✅ Shutdown source when not visible
   ```
4. Custom CSS:
   ```css
   body { 
     background-color: rgba(0,0,0,0); 
     margin: 0px; 
     overflow: hidden; 
   }
   ```

### Scene 2: TinyTV
1. Sources → Add → **Browser**
2. Name: `TinyTV`
3. Settings:
   ```
   URL: https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&loop=1
   Width: 800
   Height: 600
   FPS: 30
   ```
   (That's lofi hip hop radio - perfect for stoned frogs)

### Scene 3: MainStream (Composite)
1. Create scene: `MainStream`
2. Add **Scene Source** → `FrogStage` (full screen, bottom layer)
3. Add **Scene Source** → `TinyTV` (top layer)
4. **Transform TinyTV:**
   - Right-click → Transform → Edit Transform
   ```
   Position X: 760 px
   Position Y: 120 px
   Size: 350x260 px
   Rotation: -4°
   ```

---

## Start Everything

### Terminal 1: Web App
```bash
cd /home/dev/frog_tv/web
npm run dev
```

### Terminal 2: Check it works
```bash
# Open in browser to verify
firefox http://localhost:3000/stage
```

You should see:
- ✅ 3 frogs sitting on brown couch
- ✅ Couch at bottom of screen  
- ✅ Transparent background
- ✅ Proper spacing for TV overlay

### In OBS:
1. Select `MainStream` scene
2. Verify frogs + couch visible
3. Verify TinyTV positioned in upper area
4. Ready to stream!

---

## For YouTube Streaming

**Settings → Stream:**
```
Service: YouTube - RTMPS
Server: Primary YouTube ingest server
Stream Key: <get from YouTube Studio>
```

**Output Settings:**
```
Encoder: NVENC H.264 (your RTX 4080!)
Rate Control: CBR
Bitrate: 6000 Kbps
Keyframe Interval: 2
Preset: Quality
Profile: high
```

---

<!-- Mux support removed; use YouTube Live embeds via NEXT_PUBLIC_YOUTUBE_VIDEO_ID -->

---

## Troubleshooting

**Frogs not visible?**
```bash
# Check Firebase connection
cd /home/dev/frog_tv/web
npm run dev
# Look for errors in terminal
```

**Black screen in OBS?**
```bash
# Clear OBS browser cache
# Settings → Advanced → Delete Cache and Restart OBS
```

**Layout looks wrong?**
```bash
# Refresh browser source
# Right-click source → Refresh
```

---

## Next Steps

1. ✅ Verify frogs appear correctly
2. ✅ Adjust TinyTV position/size if needed
3. ✅ Test chat interactions
4. Deploy functions (if not done):
   ```bash
   cd /home/dev/frog_tv/functions
   firebase deploy --only functions
   ```
5. Go live!

---

🐸 **The frogs are now properly seated and ready to watch TV with philosophical contemplation.** 🐸
