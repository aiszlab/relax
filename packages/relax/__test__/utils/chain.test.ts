import { chain } from '../../src'

describe('`chain` util', () => {
  test('chain value', () => {
    const value = chain(
      (v: number) => 1,
      (v: number) => v + 1
    )

    expect(typeof value === 'function').toBeTruthy()
  })
})
