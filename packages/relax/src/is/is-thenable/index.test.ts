import { isThenable } from './index'

describe('`isThenable` util', () => {
  test('check is thenable', () => {
    expect(isThenable(Promise.resolve())).toBeTruthy()
    expect(isThenable(Promise.reject().catch(() => null))).toBeTruthy()
    expect(isThenable(new Promise(() => {}))).toBeTruthy()
    expect(isThenable('test')).toBeFalsy()
  })
})
