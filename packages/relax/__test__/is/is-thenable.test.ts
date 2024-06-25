import { isThenable } from '../../src'

describe('isThenable', () => {
  test('check null', () => {
    expect(isThenable(null)).toBeFalsy()
  })

  test('check string', () => {
    expect(isThenable('string')).toBeFalsy()
  })

  test('check number', () => {
    expect(isThenable(0)).toBeFalsy()
  })

  test('check boolean', () => {
    expect(isThenable(true)).toBeFalsy()
  })

  test('check array', () => {
    expect(isThenable([0])).toBeFalsy()
  })

  test('check object', () => {
    expect(isThenable({})).toBeFalsy()
  })

  test('check promise', () => {
    expect(isThenable(Promise.resolve())).toBeTruthy()
  })
})
