import { debounce } from './index'

describe('`debounce` util', () => {
  test('debounce callback', (done) => {
    let callCount = 0

    const { next: debounced } = debounce((value: string) => {
      callCount = callCount + 1
      return value
    }, 32)

    debounced('a')
    debounced('b')
    debounced('c')

    expect(callCount).toBe(0)

    setTimeout(() => {
      expect(callCount).toBe(1)

      debounced('d')
      debounced('e')
      debounced('f')

      expect(callCount).toBe(1)
    }, 128)

    setTimeout(() => {
      expect(callCount).toBe(2)
      done()
    }, 256)
  })
})
