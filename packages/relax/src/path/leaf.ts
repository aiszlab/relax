/**
 * @description
 * leaf
 */
export const leaf = (path: string) => {
  let start = 0;

  for (let index = path.length - 1; index >= 0; index--) {
    if (path.charCodeAt(index) === 47) {
      start = index + 1;
      break;
    }
  }

  return path.slice(start);
};
