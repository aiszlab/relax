import { type Key, useCallback, useMemo } from "react";
import type { Nullable, Partialable } from "@aiszlab/relax/types";
import { useControlledState } from "./use-controlled-state";
import { useEvent } from "./use-event";
import { unique } from "../utils/unique";

/**
 * @description
 * toggleable key
 */
type ToggleableKey = {
  /**
   * @description
   * unique key
   */
  key: Key;

  /**
   * @description
   * children
   */
  children?: ToggleableKey[];
};

/**
 * @description
 * extra options
 */
type UseToggleableOptions = {
  /**
   * @description
   * selection mode. In leaf mode, only leaf keys are stored as selected.
   * In independent mode, each key is toggled without affecting its ancestors or descendants.
   */
  selectionMode?: "all" | "leaf" | "independent";

  /**
   * @description
   * default toggled
   */
  isDefaultToggled?: boolean;

  /**
   * @description
   * toggled keys
   */
  toggledKeys?: Key[];

  /**
   * @description
   * on toggle callback
   */
  onToggle?: (keys: Key[]) => void;

  /**
   * @description
   * default toggled keys
   */
  defaultToggledKeys?: Key[];
};

/**
 * @description
 * leaf props
 */
type LeafProps = {
  /**
   * @description
   * leaf key
   */
  key: Key;

  /**
   * @description
   * parent leaf
   */
  parent: Nullable<Leaf>;

  /**
   * @description
   * the tree of the leaf
   */
  belongTo: Tree;
};

class Tree {
  #groupedLeaves: Map<Key, Set<Leaf>>;

  constructor() {
    this.#groupedLeaves = new Map();
  }

  get groupedLeaves() {
    return this.#groupedLeaves;
  }

  public grow(toggleableKey: ToggleableKey) {
    // create leaf, leaf will auto trigger tree collect callback
    new Leaf({
      key: toggleableKey.key,
      parent: null,
      belongTo: this,
    }).grow(toggleableKey.children);

    return this;
  }

  public collect(leaf: Leaf) {
    this.#groupedLeaves.has(leaf.key)
      ? this.#groupedLeaves.get(leaf.key)!.add(leaf)
      : this.#groupedLeaves.set(leaf.key, new Set([leaf]));
  }

  public toggle(key: Key, toggledKeys: Set<Key>) {
    const hasToggled = toggledKeys.has(key);
    const isToggled = !hasToggled;

    return this.toggleBy(key, isToggled, toggledKeys);
  }

  public getLeafKeys(key: Key): Key[] {
    return Array.from(this.#groupedLeaves.get(key) ?? []).flatMap((leaf) => leaf.leafKeys());
  }

  public normalizeLeafKeys(keys: Key[]): Key[] {
    return unique(
      keys.flatMap((key) =>
        this.#groupedLeaves.has(key) ? this.getLeafKeys(key) : [key],
      ),
    );
  }

  public getAllLeafKeys(): Key[] {
    return unique(
      Array.from(this.#groupedLeaves.values()).flatMap((leaves) =>
        Array.from(leaves).flatMap((leaf) => leaf.leafKeys()),
      ),
    );
  }

  public isLeafKey(key: Key) {
    return Array.from(this.#groupedLeaves.get(key) ?? []).every((leaf) => leaf.isLeaf());
  }

  private toggleBy(key: Key, isToggled: boolean, _toggledKeys: Set<Key>) {
    const toggledKeys = new Set(_toggledKeys);

    // toggle current leaf
    if (isToggled) {
      toggledKeys.add(key);
    } else {
      toggledKeys.delete(key);
    }

    return Array.from(this.#groupedLeaves.get(key) ?? []).reduce((prev, leaf) => {
      // deep fall, add or remove child key
      return leaf.rise(
        // deep rise, add or remove parent key
        leaf.fall(isToggled, prev),
      );
    }, toggledKeys);
  }
}

class Leaf {
  #key: Key;

  #belongTo: Tree;
  #parent: Nullable<Leaf>;

  #children: Leaf[];

  constructor(props: LeafProps) {
    this.#key = props.key;

    this.#parent = props.parent;
    this.#belongTo = props.belongTo;

    this.#children = [];

    // when leaf has grew, let tree collect leaf
    this.#belongTo.collect(this);
  }

  public get key() {
    return this.#key;
  }

  public isLeaf() {
    return this.#children.length === 0;
  }

  public leafKeys(): Key[] {
    return this.isLeaf() ? [this.#key] : this.#children.flatMap((child) => child.leafKeys());
  }

  public grow(children: Partialable<ToggleableKey[]> = []) {
    if (children.length === 0) return this;

    children.forEach((node) => {
      const child = new Leaf({
        key: node.key,
        parent: this,
        belongTo: this.#belongTo,
      }).grow(node.children);

      this.#children.push(child);
    });

    return this;
  }

  public rise(_toggledKeys: Set<Key>): Set<Key> {
    const rised = new Set(_toggledKeys);

    if (!this.#parent) return rised;

    const isChildrenToggled = this.#parent.#children.every((child) => rised.has(child.key));

    if (isChildrenToggled) {
      rised.add(this.#parent.key);
    } else {
      rised.delete(this.#parent.key);
    }

    // go on parent
    return this.#parent.rise(rised);
  }

  public fall(isToggled: boolean, toggledKeys: Set<Key>): Set<Key> {
    return this.#children.reduce((prev, leaf) => {
      // deep loop, remove or add key
      const fell = leaf.fall(isToggled, prev);

      // toggle true, add current leaf key
      // toggle false, remove current leaf key
      if (isToggled) {
        fell.add(leaf.key);
      } else {
        fell.delete(leaf.key);
      }

      return fell;
    }, new Set(toggledKeys));
  }
}

/**
 * @description
 * toggle able
 */
export const useToggleable = (
  toggleableKeys: ToggleableKey[],
  {
    onToggle,
    defaultToggledKeys = [],
    isDefaultToggled,
    toggledKeys,
    selectionMode = "all",
  }: UseToggleableOptions = {},
) => {
  // re-create tree when toggleable keys changed
  const tree = useMemo(() => {
    return toggleableKeys.reduce((_tree, toggleable) => {
      return _tree.grow(toggleable);
    }, new Tree());
  }, [toggleableKeys]);

  const normalizeToggledKeys = useCallback(
    (keys: Key[]) => selectionMode === "leaf" ? tree.normalizeLeafKeys(keys) : keys,
    [selectionMode, tree],
  );

  // use controlled state to record toggled keys
  const [_toggledKeys, _setToggledKeys] = useControlledState(toggledKeys, {
    defaultState: () => {
      const initialKeys = isDefaultToggled
        ? selectionMode === "leaf"
          ? tree.getAllLeafKeys()
          : Array.from(tree.groupedLeaves.keys())
        : defaultToggledKeys;

      return normalizeToggledKeys(initialKeys);
    },
  });

  // use set for toggled keys to make it read easily
  const readableToggledKeys = useMemo(
    () => new Set(normalizeToggledKeys(_toggledKeys)),
    [_toggledKeys, normalizeToggledKeys],
  );

  // check current key is toggled
  const isToggled = useCallback(
    (key: Key) => {
      if (selectionMode !== "leaf" || tree.isLeafKey(key)) {
        return readableToggledKeys.has(key);
      }

      const leafKeys = tree.getLeafKeys(key);
      return leafKeys.length > 0 && leafKeys.every((leafKey) => readableToggledKeys.has(leafKey));
    },
    [readableToggledKeys, selectionMode, tree],
  );

  // toggle one key
  const toggle = useEvent((key: Key) => {
    if (selectionMode === "independent") {
      const nextKeys = new Set(readableToggledKeys);
      if (nextKeys.has(key)) nextKeys.delete(key);
      else nextKeys.add(key);

      const nextToggledKeys = Array.from(nextKeys);
      _setToggledKeys(nextToggledKeys);
      onToggle?.(nextToggledKeys);
      return;
    }

    if (selectionMode === "leaf") {
      const keysToToggle = unique(tree.getLeafKeys(key));
      if (keysToToggle.length === 0) return;

      const shouldToggleOn = !keysToToggle.every((leafKey) => readableToggledKeys.has(leafKey));
      const nextKeys = new Set(readableToggledKeys);
      keysToToggle.forEach((leafKey) => {
        if (shouldToggleOn) nextKeys.add(leafKey);
        else nextKeys.delete(leafKey);
      });

      const nextToggledKeys = Array.from(nextKeys);
      _setToggledKeys(nextToggledKeys);
      onToggle?.(nextToggledKeys);
      return;
    }

    // get new toggled keys by toggle current key
    const _toggledKeys = Array.from(tree.toggle(key, readableToggledKeys));
    // set state
    _setToggledKeys(_toggledKeys);
    // trigger on toggle callback
    onToggle?.(_toggledKeys);
  });

  return {
    toggledKeys: readableToggledKeys,
    isToggled,
    toggle,
  };
};
