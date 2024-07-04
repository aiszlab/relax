/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { useForceUpdate } from '../../src'
import { act } from 'react'
import { describe, it, expect } from '@jest/globals'

describe('useForceUpdate', () => {
  it('force update', () => {
    const { result } = renderHook(() => useForceUpdate())

    expect(result.current[0]).toBe(1)
    expect(result.current[1]).toBeInstanceOf(Function)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(2)
  })
})
