import { effect } from '../../src/utils/effect'

describe('`effect` util', () => {
  test('call effect', () => {
    expect(effect(async () => () => {})).toBe(void 0)
    expect(typeof effect(() => () => {}) === 'function').toBeTruthy()
  })
})
