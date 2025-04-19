/**
 * property accessor regex
 */
const PROPERTY_ACCESSOR_REGEX =
  /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * use accessor to get properties
 */
function properties(path: string) {
  const result = [];

  if (path.charCodeAt(0) === 46) {
    result.push("");
  }

  path.replace(PROPERTY_ACCESSOR_REGEX, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(/\\(\\)?/g, "$1") : number || match);
    return "";
  });

  return result;
}
