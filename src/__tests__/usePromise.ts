import { renderHook, cleanup, act } from '@testing-library/react-hooks'
import { usePromise } from '../index'
import { microDelay } from './helper'

const MOCK_ERROR = new Error('MOCK ERROR')

afterEach(cleanup)

it('should call promise with specified args', async () => {
  const fn = jest.fn(() => Promise.resolve())
  const {
    result: { current },
  } = renderHook(() => usePromise(fn))

  act(() => {
    current.call()
  })

  expect(fn).toBeCalled()
  await microDelay()

  act(() => {
    // @ts-ignore
    current.call(1, true, [1, 2, 3])
  })

  expect(fn).toHaveBeenLastCalledWith(1, true, [1, 2, 3])
})

it('should set Loading in process of promise', async () => {
  const fn = jest.fn(() => Promise.resolve())
  const { result } = renderHook(() => usePromise(fn))

  act(() => {
    result.current.call()
  })

  expect(result.current.loading).toBeTruthy()
  await microDelay()
  expect(result.current.loading).toBeFalsy()
})

it('should set Error when promise throw error', async () => {
  const fn = jest.fn(() => Promise.reject(MOCK_ERROR))
  const { result } = renderHook(() => usePromise(fn))

  await act(async () => {
    try {
      await result.current.call()
    } catch (err) {
      expect(err).toBe(MOCK_ERROR)
    }
  })

  await microDelay()
  expect(result.current.error).toBe(MOCK_ERROR)
})
