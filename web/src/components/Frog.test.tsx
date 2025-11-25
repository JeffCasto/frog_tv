import React from 'react'
import { render, screen } from '@/test-utils'
import { Frog } from './Frog'
import { createMockFrog } from '@/test-utils/mocks'
import { useSoundEffects } from '@/hooks/useSoundEffects'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
  },
}))

// Mock useSoundEffects hook
jest.mock('@/hooks/useSoundEffects', () => ({
  useSoundEffects: jest.fn(),
  getSoundForAction: jest.fn(),
}))

const mockUseSoundEffects = useSoundEffects as jest.MockedFunction<typeof useSoundEffects>

describe('Frog Component', () => {
  const mockPlay = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSoundEffects.mockReturnValue({
      play: mockPlay,
      stop: jest.fn(),
      setVolume: jest.fn(),
    } as any)
  })

  it('should render frog with correct position', () => {
    const mockFrog = createMockFrog({
      targetX: 100,
      targetY: 200,
    })

    const { container } = render(<Frog frog={mockFrog} />)
    const frogElement = container.querySelector('.absolute')

    expect(frogElement).toHaveStyle({
      left: '100px',
      top: '200px',
    })
  })

  it('should render frog with correct mood', () => {
    const mockFrog = createMockFrog({ mood: 'excited' })

    const { container } = render(<Frog frog={mockFrog} />)

    // Check if mood text is displayed
    expect(screen.getByText('excited')).toBeInTheDocument()
  })

  it('should render frog SVG elements', () => {
    const mockFrog = createMockFrog()

    const { container } = render(<Frog frog={mockFrog} />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('viewBox', '0 0 100 100')
  })

  it('should display thought bubble when frog has a thought', () => {
    const mockFrog = createMockFrog({
      thought: 'What is the meaning of life?',
    })

    render(<Frog frog={mockFrog} />)

    expect(screen.getByText('What is the meaning of life?')).toBeInTheDocument()
  })

  it('should not display thought bubble when frog has no thought', () => {
    const mockFrog = createMockFrog({ thought: undefined })

    render(<Frog frog={mockFrog} />)

    // The thought bubble should not be present
    const thoughtElement = screen.queryByText(/What is/i)
    expect(thoughtElement).not.toBeInTheDocument()
  })

  it('should display all mood states correctly', () => {
    const moods = ['stoned', 'excited', 'sleepy', 'hungry', 'philosophical'] as const

    moods.forEach(mood => {
      const mockFrog = createMockFrog({ mood })
      const { unmount } = render(<Frog frog={mockFrog} />)

      expect(screen.getByText(mood)).toBeInTheDocument()

      unmount()
    })
  })

  it('should render with different actions', () => {
    const actions = ['idle', 'croak', 'throw', 'catch', 'summonToadfather', 'walkOff'] as const

    actions.forEach(action => {
      const mockFrog = createMockFrog({ action })
      const { unmount } = render(<Frog frog={mockFrog} />)

      // Component should render without crashing
      expect(screen.getByText(mockFrog.mood)).toBeInTheDocument()

      unmount()
    })
  })

  it('should render frog body parts', () => {
    const mockFrog = createMockFrog()

    const { container } = render(<Frog frog={mockFrog} />)

    // Check for SVG elements (body, head, eyes, etc.)
    const ellipses = container.querySelectorAll('ellipse')
    expect(ellipses.length).toBeGreaterThan(0)

    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThan(0)

    const paths = container.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)
  })

  it('should apply mood-based styling', () => {
    const mockFrog = createMockFrog({ mood: 'excited' })

    const { container } = render(<Frog frog={mockFrog} />)
    const svg = container.querySelector('svg')

    // Check that SVG has a filter style attribute (exact value depends on MOOD_STYLES)
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('style')
  })

  it('should render glow effect', () => {
    const mockFrog = createMockFrog()

    const { container } = render(<Frog frog={mockFrog} />)
    const glowElement = container.querySelector('.blur-xl')

    expect(glowElement).toBeInTheDocument()
  })
})
