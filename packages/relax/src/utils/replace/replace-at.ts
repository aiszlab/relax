/**
 * replace at
 */
function replaceAt<T>(value: Array<T>, index: number, replaceValue: T) {
  const _newValue = Array.from(value);

  _newValue[index] = replaceValue;

  return _newValue;
}

export { replaceAt };
