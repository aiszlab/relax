import { effect } from './index'

describe('`effect` util', () => {
  test('call effect', () => {
    expect(effect(async () => () => {})).toBe(void 0)
    expect(typeof effect(() => () => {}) === 'function').toBeTruthy()
  })
})
