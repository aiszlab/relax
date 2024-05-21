import { toArray } from './index'

describe('`toArray` util', () => {
  test('already array value', () => {
    expect(toArray([1])).toStrictEqual([1])
  })

  test('separator usage', () => {
    expect(toArray('class1 class2 class3')).toStrictEqual(['class1 class2 class3'])
    expect(toArray('class1 class2 class3', { separator: ' ' })).toStrictEqual(['class1', 'class2', 'class3'])

    expect(toArray('', { separator: '' })).toStrictEqual([])
    expect(toArray('classname', { separator: '' })).toStrictEqual(['c', 'l', 'a', 's', 's', 'n', 'a', 'm', 'e'])
  })
})
