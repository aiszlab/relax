import { toFormData } from '../../'

describe('`toFormData` util', () => {
  test('invalid data type', () => {
    const number = toFormData(0)
    const boolean = toFormData(true)
    const nullable = toFormData(null)
    const voidable = toFormData(void 0)

    expect(Array.from(number.keys()).length).toBe(0)
    expect(Array.from(boolean.keys()).length).toBe(0)
    expect(Array.from(nullable.keys()).length).toBe(0)
    expect(Array.from(voidable.keys()).length).toBe(0)
  })

  test('string type', () => {
    const value = 'string'
    const formData = toFormData(value)
    expect(Array.from(formData.keys()).length).toBe(value.length)
  })

  test('array type', () => {
    const value = ['string', 0, true, null]
    const formData = toFormData(value)
    expect(Array.from(formData.keys()).length).toBe(value.length)
  })

  test('object type', () => {
    const value = {
      text: 'string',
      count: 0,
      is: false
    }
    const formData = toFormData(value)
    expect(Array.from(formData.keys()).length).toBe(Object.keys(value).length)
  })
})
