import { isThenable } from '../../src'
import { describe, it, expect } from '@jest/globals'

describe('isThenable', () => {
  it('check null', () => {
    expect(isThenable(null)).toBeFalsy()
  })

  it('check string', () => {
    expect(isThenable('string')).toBeFalsy()
  })

  it('check number', () => {
    expect(isThenable(0)).toBeFalsy()
  })

  it('check boolean', () => {
    expect(isThenable(true)).toBeFalsy()
  })

  it('check array', () => {
    expect(isThenable([0])).toBeFalsy()
  })

  it('check object', () => {
    expect(isThenable({})).toBeFalsy()
  })

  it('check promise', () => {
    expect(isThenable(Promise.resolve())).toBeTruthy()
  })
})
