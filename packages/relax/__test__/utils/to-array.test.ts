import { toArray } from '../../src'

describe('`toArray` util', () => {
  test('already array value', () => {
    expect(toArray([0])).toStrictEqual([0])
  })

  test('separator usage', () => {
    expect(toArray('className style key')).toStrictEqual(['className style key'])
    expect(toArray('className style key', { separator: ' ' })).toStrictEqual(['className', 'style', 'key'])

    expect(toArray('', { separator: '' })).toStrictEqual([])
    expect(toArray('className', { separator: '' })).toStrictEqual(['c', 'l', 'a', 's', 's', 'N', 'a', 'm', 'e'])
  })
})
