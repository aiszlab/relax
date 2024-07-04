/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { useIdentity } from '../../src'
import { describe, it, expect } from '@jest/globals'

describe('useMount', () => {
  it('test id', async () => {
    const first = renderHook(() => useIdentity('test'))

    expect(first.result.current[0]).toBe(':r0:')
    expect(first.result.current[1]()).toBe(':r0:test:0')
    expect(first.result.current[1]()).toBe(':r0:test:1')

    first.rerender()
    expect(first.result.current[0]).toBe(':r0:')
    expect(first.result.current[1]()).toBe(':r0:test:2')
    expect(first.result.current[1]()).toBe(':r0:test:3')

    const second = renderHook(() => useIdentity('test'))
    expect(second.result.current[0]).toBe(':r1:')
    expect(second.result.current[1]()).toBe(':r1:test:0')
    expect(second.result.current[1]()).toBe(':r1:test:1')
  })
})
