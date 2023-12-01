/**
 * @description
 * if there is dom
 */
export const isDomUsable = () => {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement)
}
