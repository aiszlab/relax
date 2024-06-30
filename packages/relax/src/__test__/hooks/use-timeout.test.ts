/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { useTimeout } from '../../'

describe('useTimeout', () => {
  it('test timeout', async () => {
    jest.useFakeTimers()
    const fn = jest.fn()
    renderHook(() => useTimeout(fn, 100))

    expect(fn).toHaveBeenCalledTimes(0)

    jest.runOnlyPendingTimers()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('cancel timeout', async () => {
    jest.useFakeTimers()
    const fn = jest.fn()
    const hook = renderHook(() => useTimeout(fn, 100))
    hook.result.current.cancel()

    expect(fn).toHaveBeenCalledTimes(0)

    jest.runOnlyPendingTimers()
    expect(fn).toHaveBeenCalledTimes(0)
  })

  it('flush timeout', async () => {
    jest.useFakeTimers()
    const fn = jest.fn()
    const hook = renderHook(() => useTimeout(fn, 100))
    hook.result.current.flush()

    expect(fn).toHaveBeenCalledTimes(1)

    jest.runOnlyPendingTimers()
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
