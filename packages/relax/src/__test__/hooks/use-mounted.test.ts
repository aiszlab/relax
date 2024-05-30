/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { useMounted } from '../../hooks/use-mounted'

describe('useMounted', () => {
  it('test mounted', async () => {
    const fn = jest.fn()
    const hook = renderHook(() => useMounted(fn))
    expect(fn).toHaveBeenCalledTimes(1)
    hook.rerender()
    expect(fn).toHaveBeenCalledTimes(1)
    hook.unmount()
    expect(fn).toHaveBeenCalledTimes(1)

    renderHook(() => useMounted(fn)).unmount()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
