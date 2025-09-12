export interface TVChannel {
  id: string;
  name: string;
  description: string;
  emoji: string;
  colors: string[];
  videoUrl?: string;
  youtubeId?: string;
  streamUrl?: string;
  twitchChannel?: string;
  isLive?: boolean;
  mood?: 'chill' | 'energetic' | 'mysterious' | 'cozy';
  type?: 'video' | 'youtube' | 'stream' | 'twitch';
}

export const TV_CHANNELS: TVChannel[] = [
  {
    id: "lily_pond",
    name: "Lily Pond Live",
    description: "Relaxing nature sounds",
    emoji: "🪷",
    colors: ["#006994", "#0099CC", "#66B2FF"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: 'video',
    isLive: true,
    mood: 'chill'
  },
  {
    id: "bug_network",
    name: "Bug Network",
    description: "Insect documentaries",
    emoji: "🦟",
    colors: ["#4B5320", "#8B7355", "#A0826D"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    type: 'video',
    mood: 'energetic'
  },
  {
    id: "meme_central",
    name: "Meme Central",
    description: "Funny animal clips",
    emoji: "😂",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    type: 'video',
    mood: 'energetic'
  },
  {
    id: "rain_channel",
    name: "Rain Channel",
    description: "Soothing rain sounds",
    emoji: "🌧️",
    colors: ["#2C3E50", "#34495E", "#7F8C8D"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    type: 'video',
    mood: 'chill'
  },
  {
    id: "cosmic_frogs",
    name: "Cosmic Frogs",
    description: "Space documentaries",
    emoji: "🚀",
    colors: ["#0F0C29", "#302B63", "#24243E"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    type: 'video',
    mood: 'mysterious'
  },
  {
    id: "cooking_flies",
    name: "Cooking with Flies",
    description: "Gourmet bug recipes",
    emoji: "👨‍🍳",
    colors: ["#FF7F50", "#FF6347", "#FF4500"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    type: 'video',
    mood: 'cozy'
  },
  {
    id: "frog_news",
    name: "Frog News Network",
    description: "Breaking ribbits",
    emoji: "📰",
    colors: ["#1A1A2E", "#16213E", "#0F3460"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    type: 'video',
    isLive: true,
    mood: 'energetic'
  },
  {
    id: "meditation",
    name: "Zen Pond",
    description: "Mindful croaking",
    emoji: "🧘",
    colors: ["#A8E6CF", "#DCEDC1", "#FFD3B6"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    type: 'video',
    mood: 'chill'
  },
  {
    id: "party_pad",
    name: "Party Pad",
    description: "Non-stop hop music",
    emoji: "🎉",
    colors: ["#FF006E", "#FB5607", "#FFBE0B"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    type: 'video',
    mood: 'energetic'
  },
  {
    id: "mystery",
    name: "???",
    description: "Unknown signal...",
    emoji: "👁️",
    colors: ["#000000", "#1A0033", "#330066"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    type: 'video',
    mood: 'mysterious'
  },
  {
    id: "live_stream",
    name: "Live Stream",
    description: "24/7 nature cam",
    emoji: "📹",
    colors: ["#00C851", "#007E33", "#00FF41"],
    streamUrl: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    type: 'stream',
    isLive: true,
    mood: 'chill'
  },
  {
    id: "twitch_stream",
    name: "Twitch Gaming",
    description: "Live gaming content",
    emoji: "🎮",
    colors: ["#9146FF", "#772CE8", "#5B1FB8"],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    type: 'video',
    isLive: true,
    mood: 'energetic'
  },
  {
    id: "youtube_nature",
    name: "Nature Docs",
    description: "Amazing wildlife footage",
    emoji: "🦋",
    colors: ["#FF0000", "#CC0000", "#990000"],
    youtubeId: "dQw4w9WgXcQ",
    type: 'youtube',
    isLive: false,
    mood: 'chill'
  },
  {
    id: "youtube_music",
    name: "Chill Beats",
    description: "Relaxing background music",
    emoji: "🎵",
    colors: ["#FF0000", "#FF4444", "#FF6666"],
    youtubeId: "jfKfPfyJRdk",
    type: 'youtube',
    isLive: false,
    mood: 'cozy'
  },
];