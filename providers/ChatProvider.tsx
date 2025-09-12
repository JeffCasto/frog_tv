import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useCallback } from "react";
import { ChatMessage } from "@/types/chat";
import { useFrogTerrarium } from "./FrogTerrariumProvider";
import { useAchievements } from "./AchievementProvider";

interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  sendMessage: (text: string) => void;
  triggerEvent: (eventType: string, data?: any) => void;
  lastTriggeredEvent: { type: string; timestamp: number; data?: any } | null;
}

interface ChatEvent {
  type: string;
  trigger: string | RegExp;
  description: string;
  cooldown?: number;
  action: (data?: any) => void;
}

export const [ChatProvider, useChat] = createContextHook<ChatState>(() => {
  const { boopFrog, throwFly, changeChannel, changeRoomStyle, frogs } = useFrogTerrarium();
  const { unlockAchievement } = useAchievements();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      username: "System",
      text: "Welcome to the Frog Terrarium! 🐸 Try typing commands like 'boop all', 'rain flies', 'summon toadfather', or 'party mode'!",
      timestamp: Date.now(),
      color: "#FFD700",
    },
  ]);
  const [isConnected] = useState(true);
  const [lastTriggeredEvent, setLastTriggeredEvent] = useState<{ type: string; timestamp: number; data?: any } | null>(null);
  const [eventCooldowns, setEventCooldowns] = useState<Record<string, number>>({});

  // Define chat events
  const chatEvents: ChatEvent[] = [
    {
      type: 'boop_all',
      trigger: /boop all|boop everyone|mass boop/i,
      description: 'Boop all frogs at once',
      cooldown: 10000,
      action: () => {
        frogs.forEach(frog => boopFrog(frog.id));
        addSystemMessage("🎉 All frogs have been booped! They're so happy!");
        unlockAchievement('mass_booper');
      }
    },
    {
      type: 'rain_flies',
      trigger: /rain flies|fly storm|flies everywhere/i,
      description: 'Rain flies from the sky',
      cooldown: 15000,
      action: () => {
        for (let i = 0; i < 8; i++) {
          setTimeout(() => {
            throwFly(Math.random() * 300 + 50, Math.random() * 200 + 50);
          }, i * 200);
        }
        addSystemMessage("🌧️ It's raining flies! The frogs are in heaven!");
        unlockAchievement('fly_storm');
      }
    },
    {
      type: 'party_mode',
      trigger: /party mode|let's party|dance party/i,
      description: 'Activate party mode',
      cooldown: 30000,
      action: () => {
        changeRoomStyle('neon');
        frogs.forEach(frog => {
          setTimeout(() => boopFrog(frog.id), Math.random() * 1000);
        });
        addSystemMessage("🎉 PARTY MODE ACTIVATED! The frogs are getting down!");
        unlockAchievement('party_starter');
      }
    },
    {
      type: 'summon_toadfather',
      trigger: /summon toadfather|toadfather|the toadfather/i,
      description: 'Summon the legendary Toadfather',
      cooldown: 60000,
      action: () => {
        const now = new Date();
        const isSpecialTime = now.getHours() === 3 && now.getMinutes() === 33;
        
        if (isSpecialTime) {
          addSystemMessage("👁️ THE TOADFATHER AWAKENS... Reality bends around his presence...");
          changeRoomStyle('cosmic');
          unlockAchievement('toadfather_summoner');
        } else {
          addSystemMessage("🌙 The Toadfather stirs but does not wake... Try again at 3:33 AM...");
        }
      }
    },
    {
      type: 'zen_mode',
      trigger: /zen mode|meditation|peaceful|calm/i,
      description: 'Enter zen mode',
      cooldown: 20000,
      action: () => {
        changeRoomStyle('zen');
        addSystemMessage("🧘 Zen mode activated. The terrarium fills with peaceful energy...");
        unlockAchievement('zen_master');
      }
    },
    {
      type: 'channel_surf',
      trigger: /channel surf|surf channels|random channel/i,
      description: 'Rapidly change channels',
      cooldown: 10000,
      action: () => {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => changeChannel(), i * 500);
        }
        addSystemMessage("📺 Channel surfing activated! Hold onto your lily pads!");
        unlockAchievement('channel_surfer');
      }
    },
    {
      type: 'feed_frenzy',
      trigger: /feed frenzy|feeding time|hungry frogs/i,
      description: 'Start a feeding frenzy',
      cooldown: 25000,
      action: () => {
        for (let i = 0; i < 12; i++) {
          setTimeout(() => {
            const frogPos = frogs[Math.floor(Math.random() * frogs.length)]?.position;
            if (frogPos) {
              throwFly(frogPos.x + (Math.random() - 0.5) * 100, frogPos.y + (Math.random() - 0.5) * 50);
            }
          }, i * 300);
        }
        addSystemMessage("🍽️ FEEDING FRENZY! The frogs are going wild for flies!");
        unlockAchievement('feeding_master');
      }
    },
    {
      type: 'mystery_mode',
      trigger: /mystery mode|unknown|strange|weird/i,
      description: 'Activate mystery mode',
      cooldown: 45000,
      action: () => {
        changeRoomStyle('void');
        addSystemMessage("👁️ You have entered the void... The frogs sense something watching...");
        unlockAchievement('void_walker');
      }
    },
    {
      type: 'youtube_mode',
      trigger: /youtube|watch youtube|youtube time/i,
      description: 'Switch to YouTube channels',
      cooldown: 5000,
      action: () => {
        // Find first YouTube channel (index 11 or 12)
        for (let i = 0; i < 5; i++) {
          setTimeout(() => changeChannel(), i * 200);
        }
        addSystemMessage("📺 Switching to YouTube channels! 🍿");
        unlockAchievement('youtube_watcher');
      }
    },
    {
      type: 'dance_party',
      trigger: /dance|dancing|boogie|groove/i,
      description: 'Make the frogs dance',
      cooldown: 20000,
      action: () => {
        frogs.forEach((frog, index) => {
          for (let i = 0; i < 3; i++) {
            setTimeout(() => boopFrog(frog.id), index * 200 + i * 400);
          }
        });
        addSystemMessage("🕺 The frogs are getting their groove on! 🐸🕺");
        unlockAchievement('dance_master');
      }
    },
    {
      type: 'chaos_mode',
      trigger: /chaos|mayhem|crazy|wild/i,
      description: 'Unleash chaos in the terrarium',
      cooldown: 60000,
      action: () => {
        // Rapid channel changes
        for (let i = 0; i < 8; i++) {
          setTimeout(() => changeChannel(), i * 300);
        }
        // Fly storm
        for (let i = 0; i < 15; i++) {
          setTimeout(() => {
            throwFly(Math.random() * 300 + 50, Math.random() * 200 + 50);
          }, i * 150);
        }
        // Boop all frogs multiple times
        frogs.forEach(frog => {
          for (let i = 0; i < 5; i++) {
            setTimeout(() => boopFrog(frog.id), Math.random() * 2000);
          }
        });
        addSystemMessage("🌪️ CHAOS MODE ACTIVATED! The terrarium has gone completely wild! 🌪️");
        unlockAchievement('chaos_bringer');
      }
    },
    {
      type: 'sleepy_time',
      trigger: /sleep|sleepy|bedtime|goodnight/i,
      description: 'Put the frogs to sleep',
      cooldown: 30000,
      action: () => {
        changeRoomStyle('zen');
        addSystemMessage("🌙 Sleepy time... The frogs are getting drowsy... 😴");
        unlockAchievement('lullaby_singer');
      }
    }
  ];

  const addSystemMessage = (text: string) => {
    setMessages((prev) => [
      ...prev.slice(-20),
      {
        id: `system-${Date.now()}`,
        username: "System",
        text,
        timestamp: Date.now(),
        color: "#FFD700",
      },
    ]);
  };

  const triggerEvent = useCallback((eventType: string, data?: any) => {
    const event = chatEvents.find(e => e.type === eventType);
    if (!event) return;

    const now = Date.now();
    const lastCooldown = eventCooldowns[eventType] || 0;
    
    if (event.cooldown && now - lastCooldown < event.cooldown) {
      const remainingTime = Math.ceil((event.cooldown - (now - lastCooldown)) / 1000);
      addSystemMessage(`⏰ ${event.description} is on cooldown for ${remainingTime} more seconds.`);
      return;
    }

    event.action(data);
    setLastTriggeredEvent({ type: eventType, timestamp: now, data });
    setEventCooldowns(prev => ({ ...prev, [eventType]: now }));
  }, [eventCooldowns, chatEvents, frogs, boopFrog, throwFly, changeChannel, changeRoomStyle, unlockAchievement]);

  // Process chat messages for events
  const processMessageForEvents = useCallback((text: string) => {
    for (const event of chatEvents) {
      if (typeof event.trigger === 'string') {
        if (text.toLowerCase().includes(event.trigger.toLowerCase())) {
          triggerEvent(event.type);
          break;
        }
      } else if (event.trigger instanceof RegExp) {
        if (event.trigger.test(text)) {
          triggerEvent(event.type);
          break;
        }
      }
    }
  }, [triggerEvent, chatEvents]);

  // Simulate incoming messages with more variety
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        "Just booped Ribberto! 🎉",
        "The frogs are vibing today",
        "Channel 7 is wild right now",
        "Anyone else see that fly?",
        "Croaksworth is my spirit animal",
        "3:33 AM ritual anyone? 👀",
        "These frogs know something we don't",
        "The Toadfather watches",
        "Try typing 'boop all' in chat!",
        "Rain flies command is amazing",
        "Party mode makes the frogs dance!",
        "Has anyone summoned the Toadfather?",
        "Zen mode is so peaceful 🧘",
        "Feed frenzy gets crazy!",
        "Mystery mode is spooky...",
      ];
      
      if (Math.random() > 0.6) {
        const randomUser = `Frog_Fan_${Math.floor(Math.random() * 999)}`;
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        setMessages((prev) => [
          ...prev.slice(-20), // Keep last 20 messages
          {
            id: `msg-${Date.now()}`,
            username: randomUser,
            text: randomMessage,
            timestamp: Date.now(),
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
          },
        ]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      username: "You",
      text,
      timestamp: Date.now(),
      color: "#4A90E2",
    };
    
    setMessages((prev) => [...prev.slice(-20), newMessage]);
    
    // Process message for events
    processMessageForEvents(text);
  }, [processMessageForEvents]);

  return {
    messages,
    isConnected,
    sendMessage,
    triggerEvent,
    lastTriggeredEvent,
  };
});