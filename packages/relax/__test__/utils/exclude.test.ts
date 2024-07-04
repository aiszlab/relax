import { exclude } from '../../src'
import { describe, it, expect } from '@jest/globals'

describe('`exclude` util', () => {
  it('primitive type', () => {
    const value = exclude([0, '0', '1', false, true], [0, true])
    expect(value).toStrictEqual(['0', '1', false])
  })

  it('duplication items', () => {
    const value = exclude([0, '0', '1', false, true, '2', false, 1, true, true], [1, true])
    expect(value).toStrictEqual([0, '0', '1', false, '2', false])
  })
})
