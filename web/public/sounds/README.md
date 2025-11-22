# FrogTV Sound Effects

Place your audio files in this directory. The app expects the following sounds:

## Required Sound Files

| Sound Name | Files Needed | Description |
|------------|--------------|-------------|
| `ribbit` | `ribbit.mp3`, `ribbit.webm` | Single frog croak |
| `ribbit-chorus` | `ribbit-chorus.mp3`, `ribbit-chorus.webm` | Multiple frogs croaking together |
| `catch` | `catch.mp3`, `catch.webm` | Frog catching a fly (jump sound) |
| `munch` | `munch.mp3`, `munch.webm` | Eating/munching sound |
| `splash` | `splash.mp3`, `splash.webm` | Water splash |
| `mystery` | `mystery.mp3`, `mystery.webm` | Mysterious ambient sound |
| `summon` | `summon.mp3`, `summon.webm` | Toadfather summoning ritual |
| `walk-off` | `walk-off.mp3`, `walk-off.webm` | Footsteps/departure sound |
| `swamp-ambient` | `swamp-ambient.mp3`, `swamp-ambient.webm` | Looping ambient swamp sounds |

## Format Notes

- Provide both `.mp3` and `.webm` for maximum browser compatibility
- Keep files small (< 500KB each) for fast loading
- Suggested sample rate: 44.1kHz
- Suggested bit rate: 128kbps for MP3

## Free Sound Resources

- [Freesound.org](https://freesound.org) - Search for "frog", "ribbit", "swamp"
- [Pixabay](https://pixabay.com/sound-effects/) - Royalty-free sounds
- [ZapSplat](https://www.zapsplat.com) - Free sound effects

## Volume Levels

Volumes are pre-configured in `useSoundEffects.ts`:
- Ambient: 15% (subtle background)
- Effects: 40-80% (depending on importance)

Users can adjust master volume via the Sound Controls component.
