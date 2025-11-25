import { Frog, FrogMood, ChatMessage } from '@/types'

// Mock Frog data for testing
export const createMockFrog = (overrides?: Partial<Frog>): Frog => ({
  id: 'frog1',
  mood: 'stoned' as FrogMood,
  genreWeights: {
    mukbang: 0.25,
    sports: 0.25,
    asmr: 0.25,
    philosophy: 0.25,
  },
  action: 'idle',
  targetX: 300,
  targetY: 400,
  thought: undefined,
  ...overrides,
})

// Mock ChatMessage data for testing
export const createMockChatMessage = (overrides?: Partial<ChatMessage>): ChatMessage => ({
  id: 'msg1',
  user: 'TestUser',
  text: 'Hello, frogs!',
  ts: Date.now(),
  ...overrides,
})

// Mock Firebase subscribe function
export const createMockSubscribe = <T,>(data: T) => {
  return (callback: (data: T) => void) => {
    callback(data)
    return () => {} // Unsubscribe function
  }
}

// Mock sound effects hook
export const mockUseSoundEffects = {
  play: jest.fn(),
  stop: jest.fn(),
  setVolume: jest.fn(),
}
