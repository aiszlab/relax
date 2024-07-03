import { range } from '../../'

describe('`range` util', () => {
  test('range', () => {
    const value = range(66, 77)
    expect(value).toEqual([66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77])
  })

  test('smaller than zero', () => {
    const value = range(77, 66)
    expect(value).toEqual([])
  })
})
