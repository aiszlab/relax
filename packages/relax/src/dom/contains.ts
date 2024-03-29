export const contains = (root: Node | null | undefined, n?: Node | null) => {
  if (!root) {
    return false
  }

  // Use native if support
  if (root.contains) {
    return root.contains(n ?? null)
  }

  // `document.contains` not support with IE11
  let node = n
  while (node) {
    if (node === root) {
      return true
    }
    node = node.parentNode as Node | null
  }

  return false
}
