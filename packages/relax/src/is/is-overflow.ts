/**
 * @description
 * if is overflow
 */
export function isOverflow(element: HTMLElement = document.body) {
  if (element === document.body) {
    return (
      document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) &&
      window.innerWidth > document.body.offsetWidth
    );
  }

  // not body
  return element.scrollHeight > element.clientHeight;
}
