import { renderHook, waitFor } from '@testing-library/react'
import { useFrogs } from './useFrogs'
import { subscribeFrogs } from '@/lib/firebase'
import { Frog } from '@/types'
import { createMockFrog } from '@/test-utils/mocks'

// Mock Firebase module
jest.mock('@/lib/firebase', () => ({
  subscribeFrogs: jest.fn(),
}))

const mockSubscribeFrogs = subscribeFrogs as jest.MockedFunction<typeof subscribeFrogs>

describe('useFrogs Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with loading state', () => {
    mockSubscribeFrogs.mockReturnValue(() => {})

    const { result } = renderHook(() => useFrogs())

    expect(result.current.loading).toBe(true)
    expect(result.current.frogs).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should subscribe to frogs on mount', () => {
    mockSubscribeFrogs.mockReturnValue(() => {})

    renderHook(() => useFrogs())

    expect(mockSubscribeFrogs).toHaveBeenCalledTimes(1)
    expect(mockSubscribeFrogs).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should update frogs when data is received', async () => {
    const mockFrogsData: Record<string, Frog> = {
      frog1: createMockFrog({ id: 'frog1', mood: 'excited' }),
      frog2: createMockFrog({ id: 'frog2', mood: 'sleepy' }),
    }

    mockSubscribeFrogs.mockImplementation((callback) => {
      callback(mockFrogsData)
      return () => {}
    })

    const { result } = renderHook(() => useFrogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.frogs).toEqual(mockFrogsData)
    expect(result.current.error).toBeNull()
  })

  it('should convert frogs to array format', async () => {
    const mockFrog1 = createMockFrog({ id: 'frog1' })
    const mockFrog2 = createMockFrog({ id: 'frog2' })
    const mockFrogsData: Record<string, Frog> = {
      frog1: mockFrog1,
      frog2: mockFrog2,
    }

    mockSubscribeFrogs.mockImplementation((callback) => {
      callback(mockFrogsData)
      return () => {}
    })

    const { result } = renderHook(() => useFrogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.frogsArray).toHaveLength(2)
    expect(result.current.frogsArray).toContain(mockFrog1)
    expect(result.current.frogsArray).toContain(mockFrog2)
  })

  it('should return empty array when frogs is null', () => {
    mockSubscribeFrogs.mockReturnValue(() => {})

    const { result } = renderHook(() => useFrogs())

    expect(result.current.frogsArray).toEqual([])
  })

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Firebase connection failed')

    mockSubscribeFrogs.mockImplementation(() => {
      throw mockError
    })

    const { result } = renderHook(() => useFrogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toEqual(mockError)
    expect(result.current.frogs).toBeNull()
  })

  it('should unsubscribe on unmount', () => {
    const mockUnsubscribe = jest.fn()
    mockSubscribeFrogs.mockReturnValue(mockUnsubscribe)

    const { unmount } = renderHook(() => useFrogs())

    unmount()

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple frog updates', async () => {
    let callback: ((data: Record<string, Frog>) => void) | null = null

    mockSubscribeFrogs.mockImplementation((cb) => {
      callback = cb
      return () => {}
    })

    const { result } = renderHook(() => useFrogs())

    // First update
    const frogsData1: Record<string, Frog> = {
      frog1: createMockFrog({ id: 'frog1', mood: 'excited' }),
    }
    callback?.(frogsData1)

    await waitFor(() => {
      expect(result.current.frogs).toEqual(frogsData1)
    })

    // Second update
    const frogsData2: Record<string, Frog> = {
      frog1: createMockFrog({ id: 'frog1', mood: 'sleepy' }),
      frog2: createMockFrog({ id: 'frog2', mood: 'hungry' }),
    }
    callback?.(frogsData2)

    await waitFor(() => {
      expect(result.current.frogs).toEqual(frogsData2)
      expect(result.current.frogsArray).toHaveLength(2)
    })
  })
})
