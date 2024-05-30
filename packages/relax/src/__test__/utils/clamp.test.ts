import { clamp } from '../../utils/clamp'

describe('`clamp` util', () => {
  test('middle value', () => {
    const value = clamp(3, 9, 88)
    expect(value).toBe(9)
  })
})
