import type { Nullable, Voidable } from "@aiszlab/relax/types";

/**
 * @description
 * in musae, we add this function to replace `root.contains(n)`
 * and we use simple type declaration
 *
 * support `HTMLElement` interface
 */
export type Containable = {
  /**
   * @description
   * native `contains` api
   */
  contains?: (node: Nullable<Node>) => boolean;
};

export const contains = (root: Voidable<Containable>, node: Voidable<Node>) => {
  if (!root) {
    return false;
  }

  // Use native if support
  if (root.contains) {
    return root.contains(node ?? null);
  }

  // `document.contains` not support with IE11
  let _node = node;
  while (_node) {
    if (_node === root) {
      return true;
    }
    _node = _node.parentNode;
  }

  return false;
};
