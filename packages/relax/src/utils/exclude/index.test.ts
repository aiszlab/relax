import { exclude } from './index'

describe('`exclude` util', () => {
  test('primitive type', () => {
    const value = exclude([1, '2', 'test', false, true], [1, true])
    expect(value).toStrictEqual(['2', 'test', false])
  })

  test('duplication items', () => {
    const value = exclude([1, '2', 'test', false, true, '2', false, 1, true, true], [1, true])
    expect(value).toStrictEqual(['2', 'test', false, '2', false])
  })
})
