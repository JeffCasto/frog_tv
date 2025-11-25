import {
  MOOD_STYLES,
  FROG_IDS,
  DEFAULT_FROG_STATE,
  DEFAULT_TRIGGERS,
  PHILOSOPHY_KEYWORDS,
  FOOD_KEYWORDS,
  EXCITEMENT_KEYWORDS,
  SLEEP_KEYWORDS,
  FrogMood,
} from './index'

describe('Type Constants', () => {
  describe('MOOD_STYLES', () => {
    it('should have styles for all mood types', () => {
      const moods: FrogMood[] = ['stoned', 'excited', 'sleepy', 'hungry', 'philosophical']

      moods.forEach(mood => {
        expect(MOOD_STYLES[mood]).toBeDefined()
        expect(MOOD_STYLES[mood]).toHaveProperty('filter')
        expect(MOOD_STYLES[mood]).toHaveProperty('color')
        expect(MOOD_STYLES[mood]).toHaveProperty('glow')
      })
    })

    it('should have valid CSS filter values', () => {
      Object.values(MOOD_STYLES).forEach(style => {
        expect(typeof style.filter).toBe('string')
        expect(style.filter.length).toBeGreaterThan(0)
      })
    })

    it('should have valid color values', () => {
      Object.values(MOOD_STYLES).forEach(style => {
        expect(style.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      })
    })

    it('should have valid glow values', () => {
      Object.values(MOOD_STYLES).forEach(style => {
        expect(style.glow).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/)
      })
    })
  })

  describe('FROG_IDS', () => {
    it('should have exactly 3 frog IDs', () => {
      expect(FROG_IDS).toHaveLength(3)
    })

    it('should have unique frog IDs', () => {
      const uniqueIds = new Set(FROG_IDS)
      expect(uniqueIds.size).toBe(FROG_IDS.length)
    })

    it('should have expected frog ID format', () => {
      FROG_IDS.forEach(id => {
        expect(id).toMatch(/^frog\d+$/)
      })
    })
  })

  describe('DEFAULT_FROG_STATE', () => {
    it('should have all required properties', () => {
      expect(DEFAULT_FROG_STATE).toHaveProperty('mood')
      expect(DEFAULT_FROG_STATE).toHaveProperty('genreWeights')
      expect(DEFAULT_FROG_STATE).toHaveProperty('action')
      expect(DEFAULT_FROG_STATE).toHaveProperty('targetX')
      expect(DEFAULT_FROG_STATE).toHaveProperty('targetY')
    })

    it('should have valid default mood', () => {
      const validMoods: FrogMood[] = ['stoned', 'excited', 'sleepy', 'hungry', 'philosophical']
      expect(validMoods).toContain(DEFAULT_FROG_STATE.mood)
    })

    it('should have balanced genre weights', () => {
      const { genreWeights } = DEFAULT_FROG_STATE
      expect(genreWeights.mukbang).toBe(0.25)
      expect(genreWeights.sports).toBe(0.25)
      expect(genreWeights.asmr).toBe(0.25)
      expect(genreWeights.philosophy).toBe(0.25)
    })

    it('should have genre weights that sum to 1', () => {
      const { genreWeights } = DEFAULT_FROG_STATE
      const sum = Object.values(genreWeights).reduce((a, b) => a + b, 0)
      expect(sum).toBeCloseTo(1.0, 5)
    })

    it('should have valid position coordinates', () => {
      expect(DEFAULT_FROG_STATE.targetX).toBeGreaterThan(0)
      expect(DEFAULT_FROG_STATE.targetY).toBeGreaterThan(0)
    })

    it('should have idle as default action', () => {
      expect(DEFAULT_FROG_STATE.action).toBe('idle')
    })
  })

  describe('DEFAULT_TRIGGERS', () => {
    it('should have all required trigger properties', () => {
      expect(DEFAULT_TRIGGERS).toHaveProperty('ribbitCount')
      expect(DEFAULT_TRIGGERS).toHaveProperty('lastRibbitReset')
      expect(DEFAULT_TRIGGERS).toHaveProperty('toadfatherSummoned')
      expect(DEFAULT_TRIGGERS).toHaveProperty('frogsWalkedOff')
    })

    it('should have ribbitCount initialized to 0', () => {
      expect(DEFAULT_TRIGGERS.ribbitCount).toBe(0)
    })

    it('should have toadfatherSummoned initialized to false', () => {
      expect(DEFAULT_TRIGGERS.toadfatherSummoned).toBe(false)
    })

    it('should have frogsWalkedOff as empty array', () => {
      expect(DEFAULT_TRIGGERS.frogsWalkedOff).toEqual([])
      expect(Array.isArray(DEFAULT_TRIGGERS.frogsWalkedOff)).toBe(true)
    })

    it('should have lastRibbitReset as a valid timestamp', () => {
      expect(typeof DEFAULT_TRIGGERS.lastRibbitReset).toBe('number')
      expect(DEFAULT_TRIGGERS.lastRibbitReset).toBeGreaterThan(0)
    })
  })

  describe('Keyword Arrays', () => {
    it('PHILOSOPHY_KEYWORDS should be non-empty array of strings', () => {
      expect(Array.isArray(PHILOSOPHY_KEYWORDS)).toBe(true)
      expect(PHILOSOPHY_KEYWORDS.length).toBeGreaterThan(0)
      PHILOSOPHY_KEYWORDS.forEach(keyword => {
        expect(typeof keyword).toBe('string')
        expect(keyword.length).toBeGreaterThan(0)
      })
    })

    it('FOOD_KEYWORDS should be non-empty array of strings', () => {
      expect(Array.isArray(FOOD_KEYWORDS)).toBe(true)
      expect(FOOD_KEYWORDS.length).toBeGreaterThan(0)
      FOOD_KEYWORDS.forEach(keyword => {
        expect(typeof keyword).toBe('string')
        expect(keyword.length).toBeGreaterThan(0)
      })
    })

    it('EXCITEMENT_KEYWORDS should be non-empty array of strings', () => {
      expect(Array.isArray(EXCITEMENT_KEYWORDS)).toBe(true)
      expect(EXCITEMENT_KEYWORDS.length).toBeGreaterThan(0)
      EXCITEMENT_KEYWORDS.forEach(keyword => {
        expect(typeof keyword).toBe('string')
        expect(keyword.length).toBeGreaterThan(0)
      })
    })

    it('SLEEP_KEYWORDS should be non-empty array of strings', () => {
      expect(Array.isArray(SLEEP_KEYWORDS)).toBe(true)
      expect(SLEEP_KEYWORDS.length).toBeGreaterThan(0)
      SLEEP_KEYWORDS.forEach(keyword => {
        expect(typeof keyword).toBe('string')
        expect(keyword.length).toBeGreaterThan(0)
      })
    })

    it('keyword arrays should not overlap', () => {
      const allKeywords = [
        ...PHILOSOPHY_KEYWORDS,
        ...FOOD_KEYWORDS,
        ...EXCITEMENT_KEYWORDS,
        ...SLEEP_KEYWORDS,
      ]
      const uniqueKeywords = new Set(allKeywords)
      expect(uniqueKeywords.size).toBe(allKeywords.length)
    })
  })
})
