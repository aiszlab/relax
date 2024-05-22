import { throttle } from './index'

describe('`throttle` util', () => {
  test('throttle callback', (done) => {
    let callCount = 0

    const { next: throttled } = throttle((value: string) => {
      callCount = callCount + 1
      return value
    }, 32)

    throttled('a')
    throttled('b')
    throttled('c')

    expect(callCount).toBe(1)

    setTimeout(() => {
      expect(callCount).toBe(1)

      throttled('d')
      throttled('e')
      throttled('f')

      expect(callCount).toBe(2)
    }, 128)

    setTimeout(() => {
      expect(callCount).toBe(2)
      done()
    }, 256)
  })
})
