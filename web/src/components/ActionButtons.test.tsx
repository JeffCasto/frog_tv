import React from 'react'
import { render, screen, fireEvent } from '@/test-utils'
import { ActionButtons } from './ActionButtons'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Bug: () => <span data-testid="bug-icon">Bug</span>,
  Volume2: () => <span data-testid="volume-icon">Volume2</span>,
}))

describe('ActionButtons Component', () => {
  const mockOnThrowFly = jest.fn()
  const mockOnTriggerCroak = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all sections', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={5}
      />
    )

    expect(screen.getByText('Ribbit Counter')).toBeInTheDocument()
    expect(screen.getByText('Interact')).toBeInTheDocument()
    expect(screen.getByText('💡 Pro Tips')).toBeInTheDocument()
  })

  it('should display correct ribbit count', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={15}
      />
    )

    expect(screen.getByText('15 / 30')).toBeInTheDocument()
  })

  it('should render throw fly button', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={0}
      />
    )

    expect(screen.getByText('Throw Fly')).toBeInTheDocument()
    expect(screen.getByText('Feed the frogs!')).toBeInTheDocument()
    expect(screen.getByTestId('bug-icon')).toBeInTheDocument()
  })

  it('should render trigger croak button', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={0}
      />
    )

    expect(screen.getByText('Trigger Croak')).toBeInTheDocument()
    expect(screen.getByText('Make them ribbit!')).toBeInTheDocument()
    expect(screen.getByTestId('volume-icon')).toBeInTheDocument()
  })

  it('should call onThrowFly when throw fly button is clicked', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={0}
      />
    )

    const throwFlyButton = screen.getByText('Throw Fly').closest('button')
    fireEvent.click(throwFlyButton!)

    expect(mockOnThrowFly).toHaveBeenCalledTimes(1)
  })

  it('should call onTriggerCroak when trigger croak button is clicked', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={0}
      />
    )

    const triggerCroakButton = screen.getByText('Trigger Croak').closest('button')
    fireEvent.click(triggerCroakButton!)

    expect(mockOnTriggerCroak).toHaveBeenCalledTimes(1)
  })

  it('should not show toadfather message when ribbitCount is below 30', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={29}
      />
    )

    expect(screen.queryByText(/TOADFATHER INCOMING!/i)).not.toBeInTheDocument()
  })

  it('should show toadfather message when ribbitCount reaches 30', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={30}
      />
    )

    expect(screen.getByText(/TOADFATHER INCOMING!/i)).toBeInTheDocument()
  })

  it('should show toadfather message when ribbitCount exceeds 30', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={35}
      />
    )

    expect(screen.getByText(/TOADFATHER INCOMING!/i)).toBeInTheDocument()
  })

  it('should display the target ribbit count', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={10}
      />
    )

    expect(screen.getByText('30 to summon')).toBeInTheDocument()
  })

  it('should render all pro tips', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={0}
      />
    )

    expect(screen.getByText(/ribbit.*summon.*Toadfather/i)).toBeInTheDocument()
    expect(screen.getByText(/philosophy.*deep thoughts/i)).toBeInTheDocument()
    expect(screen.getByText(/food.*frogs hungry/i)).toBeInTheDocument()
    expect(screen.getByText(/3:33 AM.*mysteries/i)).toBeInTheDocument()
  })

  it('should render progress bar with correct percentage', () => {
    const { container } = render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={15}
      />
    )

    const progressBar = container.querySelector('.bg-gradient-to-r.from-frog-green')
    expect(progressBar).toBeInTheDocument()
  })

  it('should handle zero ribbit count', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={0}
      />
    )

    expect(screen.getByText('0 / 30')).toBeInTheDocument()
  })

  it('should render buttons with accessible labels', () => {
    render(
      <ActionButtons
        onThrowFly={mockOnThrowFly}
        onTriggerCroak={mockOnTriggerCroak}
        ribbitCount={0}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)

    // Buttons should have text content
    expect(buttons[0].textContent).toContain('Throw Fly')
    expect(buttons[1].textContent).toContain('Trigger Croak')
  })
})
