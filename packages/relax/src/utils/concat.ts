/**
 * @description
 * concat array
 */
const concat = <T>(...arrays: T[][]): T[] => {
  return arrays.reduce((_concat, _array) => {
    return _concat.concat(_array);
  }, []);
};

export { concat };
