/**
 * @description
 * if is overflow
 */
export function isOverflow() {
  return (
    document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) &&
    window.innerWidth > document.body.offsetWidth
  )
}
