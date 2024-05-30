/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import { useBoolean } from '../../src/hooks/use-boolean'

describe('useBoolean', () => {
  it('test on methods', async () => {
    const { result } = renderHook(() => useBoolean())
    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1].turnOn()
    })
    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1].turnOff()
    })
    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1].toggle()
    })
    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1].toggle()
    })
    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1].setBoolean(false)
    })
    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1].setBoolean(true)
    })
    expect(result.current[0]).toBe(true)
  })

  it('test on default value', () => {
    const hook1 = renderHook(() => useBoolean(true))
    expect(hook1.result.current[0]).toBe(true)

    const hook2 = renderHook(() => useBoolean())
    expect(hook2.result.current[0]).toBe(false)
  })
})
