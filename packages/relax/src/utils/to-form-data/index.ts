/**
 * @description
 * convert to formData
 */
export const toFormData = (data: Record<string, unknown>) => {
  const formData = new FormData()

  Object.keys(data).forEach((key) => {
    const value = data[key]
    // support key-value array data
    if (Array.isArray(value)) {
      value.forEach((item) => {
        // { list: [ 11, 22 ] }
        // formData.append('list[]', 11);
        formData.append(`${key}[]`, item)
      })
      return
    }

    formData.append(key, value as string | Blob)
  })

  return formData
}
