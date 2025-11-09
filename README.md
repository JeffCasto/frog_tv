# 🐸 FrogTV Live

**A surreal, interactive livestreaming platform where three animated frogs sit on a couch watching content on a "tiny TV" while viewers interact with them through chat commands.**

Think Twitch Plays Pokemon meets late-night Adult Swim meets performance art.

---

## 🎯 What Is This?

Viewers watch a livestream of frogs watching TV. The frogs react to both:
- The content they're watching on the tiny TV
- Chat interactions from viewers

This creates a recursive loop of entertainment that's oddly mesmerizing. It's intentionally absurd, technically sophisticated, and designed to create a compelling "why am I watching this?" experience.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Next.js Web App (Viewer Experience)       │
│  - Mux Video Player                         │
│  - Real-time Chat                           │
│  - Interaction Buttons                      │
└─────────────────────────────────────────────┘
                    ↓↑
┌─────────────────────────────────────────────┐
│  Firebase Realtime Database                 │
│  - Frog states                              │
│  - Chat messages                            │
│  - Triggers & Lore                          │
└─────────────────────────────────────────────┘
                    ↓↑
┌─────────────────────────────────────────────┐
│  Firebase Cloud Functions                   │
│  - Chat processing                          │
│  - Action handlers                          │
│  - Scheduled events                         │
└─────────────────────────────────────────────┘
                    ↓↑
┌─────────────────────────────────────────────┐
│  OBS Studio → Mux Streaming                │
│  - Browser source (frogs)                   │
│  - Video source (tiny TV)                   │
│  - Composite stream                         │
└─────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+** installed
2. **Firebase account** (free Spark plan)
3. **Mux account** (free 5,000 min/month)
4. **OBS Studio 28+** installed
5. **(Optional)** Domain name

### Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd frog_tv

# Install web dependencies
cd web
npm install

# Install functions dependencies
cd ../functions
npm install
```

### Step 2: Set Up Firebase

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select:
# - Realtime Database
# - Functions
# - Hosting (optional)

# Choose existing project or create new one
# Select TypeScript for Functions
# Use existing files (don't overwrite)
```

**Update `.firebaserc`:**
```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

**Initialize the database:**
```bash
# Deploy database rules
firebase deploy --only database

# Initialize database with default frog data
# You can use the Firebase Console or run this in Firebase Shell:
```

Go to Firebase Console → Realtime Database → Import JSON:
```json
{
  "frogs": {
    "frog1": {
      "id": "frog1",
      "mood": "stoned",
      "genreWeights": { "mukbang": 0.8, "sports": 0.1, "asmr": 0.5, "philosophy": 0.3 },
      "action": "idle",
      "targetX": 200,
      "targetY": 400,
      "thought": null
    },
    "frog2": {
      "id": "frog2",
      "mood": "philosophical",
      "genreWeights": { "mukbang": 0.2, "sports": 0.3, "asmr": 0.6, "philosophy": 0.9 },
      "action": "idle",
      "targetX": 500,
      "targetY": 420,
      "thought": null
    },
    "frog3": {
      "id": "frog3",
      "mood": "excited",
      "genreWeights": { "mukbang": 0.9, "sports": 0.7, "asmr": 0.2, "philosophy": 0.1 },
      "action": "idle",
      "targetX": 800,
      "targetY": 400,
      "thought": null
    }
  },
  "triggers": {
    "ribbitCount": 0,
    "lastRibbitReset": 0,
    "toadfatherSummoned": false,
    "frogsWalkedOff": []
  }
}
```

### Step 3: Configure Environment Variables

**Create `web/.env.local`:**
```bash
cd web
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase credentials (from Firebase Console → Project Settings):
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_MUX_PLAYBACK_ID=your_mux_playback_id
```

### Step 4: Deploy Cloud Functions

```bash
cd functions
npm run build
firebase deploy --only functions
```

### Step 5: Run the Web App Locally

```bash
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎥 OBS Studio Configuration

### Scene Setup

1. **Create Scene: "TinyTV"**
   - Add **Browser Source** or **VLC Video Source**
   - For YouTube: Use URL `https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1`
   - Size: 400x300 (will be scaled/rotated in composite)

2. **Create Scene: "FrogStage"**
   - Add **Browser Source**
   - URL: `http://localhost:3000/stage` (or your deployed URL)
   - Width: 1920
   - Height: 1080
   - FPS: 30
   - Custom CSS:
   ```css
   body {
     background-color: rgba(0,0,0,0);
     margin: 0px auto;
     overflow: hidden;
   }
   ```

3. **Create Scene: "MainStream" (Composite)**
   - Add **Scene Source**: TinyTV (bottom layer)
     - Apply **Corner Pin** filter to create TV perspective
     - Apply **Scale/Aspect Ratio** filter: 20% size
     - Position in corner, rotated slightly
   - Add **Scene Source**: FrogStage (top layer)
     - Full screen overlay

### Mux Streaming Setup

1. Create Mux account at [mux.com](https://mux.com)
2. Create a new **Live Stream**
3. Copy the **RTMP URL** and **Stream Key**
4. In OBS: Settings → Stream
   - Service: Custom
   - Server: `rtmp://global-live.mux.com:5222/app`
   - Stream Key: `<your-stream-key>`
5. Copy the **Playback ID** to your `.env.local` as `NEXT_PUBLIC_MUX_PLAYBACK_ID`

### Start Streaming

1. Open OBS
2. Select "MainStream" scene
3. Click "Start Streaming"
4. Verify stream appears at [http://localhost:3000](http://localhost:3000)

---

## 🎮 Interactive Features

### Chat Commands (Automatic)

These are processed automatically by Cloud Functions:

- **"ribbit"** (30x) → Summons the Toadfather
- **Philosophy words** (reality, consciousness, etc.) → Frog becomes philosophical
- **Food words** (hungry, fly, eat, etc.) → Frog gets hungry
- **Excitement words** (wow, amazing, hype, etc.) → Frog gets excited
- **Sleep words** (tired, sleepy, nap, etc.) → Frog gets sleepy

### Action Buttons

- **Throw Fly** → Random frog catches and eats it
- **Trigger Croak** → All frogs croak simultaneously

### Scheduled Events

- **3:33 AM Daily** → "Midnight Mysteries" - mysterious events occur
- **1st of Month** → "Great Exodus" - all frogs walk off and are replaced

---

## 📁 Project Structure

```
frog_tv/
├── web/                          # Next.js web application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Frog.tsx         # Animated frog component
│   │   │   ├── ChatBox.tsx      # Chat interface
│   │   │   └── ActionButtons.tsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useFrogs.ts
│   │   │   ├── useChat.ts
│   │   │   └── useTriggers.ts
│   │   ├── lib/
│   │   │   └── firebase.ts      # Firebase client config
│   │   ├── pages/
│   │   │   ├── index.tsx        # Main viewer page
│   │   │   ├── stage.tsx        # OBS browser source
│   │   │   └── lore.tsx         # Historical events
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── types/
│   │       └── index.ts         # TypeScript types
│   └── package.json
│
├── functions/                    # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts             # All cloud functions
│   ├── package.json
│   └── tsconfig.json
│
├── firebase.json                # Firebase configuration
├── database.rules.json          # Database security rules
└── .firebaserc                  # Firebase project reference
```

---

## 🎨 Customization Ideas

### Easy Extensions

1. **More Chat Triggers**: Add new keyword detection
2. **Viewer Stats**: Track total ribbits, active users, etc.
3. **Custom Moods**: Add new frog moods with unique colors
4. **Sound Effects**: Add ribbit sounds when frogs croak

### Medium Complexity

1. **TV Channel Switching**: Allow viewers to vote on content
2. **Frog Personality Evolution**: Track preferences over time
3. **Achievement System**: Unlock badges for interactions
4. **Multiple Camera Angles**: Switch between views

### Advanced Features

1. **AI Content Reactions**: Use STT + LLM for contextual thoughts
2. **Procedural Frog Evolution**: Frogs change appearance over time
3. **Community Events**: Special events triggered by milestones
4. **NFT Integration**: Unique frog variations as collectibles (if you're into that)

---

## 🔧 Development

### Run Locally

```bash
# Terminal 1: Web app
cd web
npm run dev

# Terminal 2: Functions emulator
cd functions
npm run serve

# Terminal 3: Firebase emulators (optional)
firebase emulators:start
```

### Build for Production

```bash
# Build web app
cd web
npm run build

# Build functions
cd functions
npm run build
```

### Deploy

```bash
# Deploy everything
firebase deploy

# Deploy specific targets
firebase deploy --only functions
firebase deploy --only database
firebase deploy --only hosting
```

---

## 🐛 Troubleshooting

### "Firebase not initialized" error

Make sure you've created `.env.local` with correct Firebase credentials.

### OBS browser source shows black screen

1. Check that the web app is running
2. Verify the URL is correct
3. Try clearing OBS browser cache: Settings → Advanced → Delete Cache

### Frogs not appearing

1. Check Firebase Database has frog data
2. Check browser console for errors
3. Verify Firebase rules allow reads

### Chat messages not triggering reactions

1. Check Cloud Functions are deployed
2. Check Functions logs: `firebase functions:log`
3. Verify database rules allow writes to `/chat`

---

## 📜 License

This project is released under the MIT License. Use it, modify it, make it weirder.

---

## 🙏 Credits

Built with:
- **Next.js** - React framework
- **Firebase** - Realtime database & cloud functions
- **Framer Motion** - Animations
- **Mux** - Video streaming
- **Tailwind CSS** - Styling
- **OBS Studio** - Streaming software

---

## 🐸 Final Thoughts

FrogTV Live is a reminder that the internet is still a weird and wonderful place. May your frogs be philosophical, your ribbits be plentiful, and your Toadfather always arrive on time.

*"The frogs watch TV. You watch the frogs. The TV watches you. Who's really watching whom?"*

---

**Ready to start?** Run `cd web && npm run dev` and let the absurdity begin.
