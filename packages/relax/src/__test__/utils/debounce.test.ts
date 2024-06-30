import { debounce } from '../../'

describe('`debounce` util', () => {
  test('debounce callback', (done) => {
    let callCount = 0

    const { next: debounced } = debounce((value: string) => {
      callCount = callCount + 1
      return value
    }, 32)

    debounced('0')
    debounced('1')
    debounced('2')

    expect(callCount).toBe(0)

    setTimeout(() => {
      expect(callCount).toBe(1)

      debounced('3')
      debounced('4')
      debounced('5')

      expect(callCount).toBe(1)
    }, 128)

    setTimeout(() => {
      expect(callCount).toBe(2)
      done()
    }, 256)
  })
})
