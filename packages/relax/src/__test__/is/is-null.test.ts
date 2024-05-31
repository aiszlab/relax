import { isNull } from '../../is/is-null'

describe('isNull', () => {
  test('check null', () => {
    expect(isNull(null)).toBeTruthy()
  })

  test('check string', () => {
    expect(isNull('string')).toBeFalsy()
  })

  test('check number', () => {
    expect(isNull(0)).toBeFalsy()
  })

  test('check boolean', () => {
    expect(isNull(true)).toBeFalsy()
  })

  test('check array', () => {
    expect(isNull([0])).toBeFalsy()
  })

  test('check object', () => {
    expect(isNull({})).toBeFalsy()
  })

  test('check promise', () => {
    expect(isNull(Promise.resolve())).toBeFalsy()
  })
})
