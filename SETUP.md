# FrogTV Live - Setup Guide

Follow these steps to get FrogTV Live up and running.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Firebase account created
- [ ] Mux account created (optional for local testing)
- [ ] OBS Studio installed

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install web app dependencies
cd web
npm install

# Install cloud functions dependencies
cd ../functions
npm install
```

### 2. Firebase Setup

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Name it (e.g., "frogtv-live")
4. Disable Google Analytics (optional)
5. Click "Create Project"

#### Enable Realtime Database

1. In Firebase Console, go to "Realtime Database"
2. Click "Create Database"
3. Choose location (e.g., US)
4. Start in **Test Mode** (we'll update rules later)

#### Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Web" (</> icon)
4. Register app (nickname: "FrogTV Web")
5. Copy the `firebaseConfig` object

#### Configure Environment Variables

Create `web/.env.local`:
```bash
cp web/.env.local.example web/.env.local
```

Paste your Firebase config into `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

#### Update Firebase Project Reference

Edit `.firebaserc`:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 3. Initialize Firebase Database

#### Option A: Firebase Console (Recommended)

1. Go to Firebase Console → Realtime Database
2. Click the three dots (⋮) → Import JSON
3. Upload `scripts/init-database.json`
4. Confirm import

#### Option B: Firebase CLI

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy database rules first
firebase deploy --only database

# Then manually import via console (Option A above)
```

### 4. Deploy Cloud Functions

```bash
cd functions
npm run build
firebase deploy --only functions
```

Verify deployment:
```bash
firebase functions:log
```

### 5. Test Locally

```bash
cd web
npm run dev
```

Open http://localhost:3000

You should see:
- ✅ Three frogs displayed in "Meet the Frogs" section
- ✅ Chat box functional
- ✅ Ribbit counter at 0/30
- ✅ Interaction buttons

### 6. Test Chat Processing

1. Type "ribbit" in chat → Counter should increment
2. Type "reality" → Frog2 should become philosophical
3. Type "hungry" → Frog3 should become hungry
4. Click "Throw Fly" → Random frog catches it
5. Click "Trigger Croak" → All frogs croak

### 7. Set Up Mux (For Livestreaming)

#### Create Mux Account

1. Go to [mux.com](https://mux.com)
2. Sign up (free tier: 5,000 minutes/month)
3. Verify email

#### Create Live Stream

1. Go to Mux Dashboard
2. Click "Live Streams"
3. Click "Create New Live Stream"
4. Settings:
   - Latency Mode: Standard
   - Recording: Disabled (for testing)
5. Copy:
   - **Stream Key** (for OBS)
   - **Playback ID** (for web player)

#### Add to Environment

Update `web/.env.local`:
```
NEXT_PUBLIC_MUX_PLAYBACK_ID=your_playback_id_here
```

Restart dev server:
```bash
npm run dev
```

### 8. Configure OBS Studio

#### Install OBS

Download from [obsproject.com](https://obsproject.com)

#### Create Scenes

**Scene 1: FrogStage**
1. Add Source → Browser
2. URL: `http://localhost:3000/stage`
3. Width: 1920
4. Height: 1080
5. FPS: 30
6. Custom CSS:
   ```css
   body {
     background-color: rgba(0,0,0,0);
     margin: 0px auto;
     overflow: hidden;
   }
   ```

**Scene 2: TinyTV**
1. Add Source → Browser (for YouTube) OR VLC Video Source
2. For YouTube:
   - URL: `https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1`
   - Width: 800
   - Height: 600

**Scene 3: MainStream (Composite)**
1. Add Source → Scene → TinyTV
2. Transform → Edit Transform:
   - Position: 50, 50
   - Scale: 20%
   - Rotation: -5°
3. Add Source → Scene → FrogStage
4. Position above TinyTV

#### Configure Streaming

1. Settings → Stream
2. Service: Custom
3. Server: `rtmp://global-live.mux.com:5222/app`
4. Stream Key: `<your-mux-stream-key>`
5. Click OK

#### Test Stream

1. Select "MainStream" scene
2. Click "Start Streaming"
3. Wait 10-20 seconds
4. Refresh http://localhost:3000
5. Video player should show your stream

### 9. Production Deployment

#### Deploy to Vercel

```bash
cd web
npm install -g vercel
vercel login
vercel
```

Follow prompts:
- Project name: frogtv-live
- Framework: Next.js
- Root: ./web

Add environment variables in Vercel dashboard.

#### Update OBS Stream URL

Change FrogStage browser source URL to:
`https://your-vercel-url.vercel.app/stage`

## Troubleshooting

### Frogs not showing

**Check:**
1. Firebase database initialized?
2. Environment variables correct?
3. Browser console errors?

**Fix:**
```bash
# Re-import database
firebase database:set / scripts/init-database.json
```

### Chat not working

**Check:**
1. Cloud functions deployed?
2. Database rules allow writes to /chat?

**Fix:**
```bash
firebase deploy --only functions
firebase deploy --only database
```

### OBS black screen

**Check:**
1. Web app running?
2. URL correct?
3. Browser cache?

**Fix:**
1. Settings → Advanced → Delete Cache
2. Recreate browser source

### Video player not loading

**Check:**
1. Mux playback ID correct?
2. Stream key correct in OBS?
3. Actually streaming from OBS?

**Fix:**
1. Verify NEXT_PUBLIC_MUX_PLAYBACK_ID in .env.local
2. Check Mux dashboard for active stream

## Next Steps

Once everything works:

1. ✅ Customize frog behaviors in `functions/src/index.ts`
2. ✅ Add more chat triggers
3. ✅ Create custom moods and animations
4. ✅ Set up analytics
5. ✅ Promote your stream!

## Need Help?

Check the logs:
```bash
# Web app errors
Browser console (F12)

# Cloud function errors
firebase functions:log

# OBS errors
Help → Log Files → Current Log
```

---

**You're ready!** 🐸 Let the frogs watch TV while you watch them.
