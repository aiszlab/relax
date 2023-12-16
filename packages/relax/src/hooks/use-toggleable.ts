import { Key, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Nullable } from '../types'
import { Partialable } from '../types/partial-able'

/**
 * @description
 * toggleable key
 */
type ToggleableKey = {
  /**
   * @description
   * unique key
   */
  key: Key

  /**
   * @description
   * children
   */
  children?: ToggleableKey[]
}

/**
 * @description
 * extra options
 */
type Options = {
  /**
   * @description
   * default toggled
   */
  isDefaultToggled?: boolean

  /**
   * @description
   * toggled keys
   */
  toggledKeys?: Key[]
}

/**
 * @description
 * leaf props
 */
type LeafProps = {
  /**
   * @description
   * leaf key
   */
  key: Key

  /**
   * @description
   * parent leaf
   */
  parent: Nullable<Leaf>

  /**
   * @description
   * the tree of the leaf
   */
  belongTo: Tree
}

class Tree {
  #leaves: Set<Leaf>
  #toggledLeaves: Set<Leaf>
  #groupedLeaves: Map<Key, Set<Leaf>>
  #isDefaultToggled: boolean

  constructor({ isDefaultToggled }: Pick<Required<Options>, 'isDefaultToggled'>) {
    this.#leaves = new Set()
    this.#toggledLeaves = new Set()
    this.#groupedLeaves = new Map()
    this.#isDefaultToggled = !!isDefaultToggled
  }

  get isAllToggled() {
    return this.#leaves.size === this.#toggledLeaves.size
  }

  get toggledLeaves() {
    return this.#toggledLeaves
  }

  get groupedLeaves() {
    return this.#groupedLeaves
  }

  public grow(toggleableKey: ToggleableKey) {
    this.#leaves.add(
      new Leaf({
        key: toggleableKey.key,
        parent: null,
        belongTo: this
      }).grow(toggleableKey.children)
    )
    return this
  }

  public collect(leaf: Leaf) {
    this.#groupedLeaves.has(leaf.key)
      ? this.#groupedLeaves.set(leaf.key, new Set([leaf]))
      : this.#groupedLeaves.get(leaf.key)!.add(leaf)

    // if default toggled, add leaf to toggled leaves
    this.#isDefaultToggled && this.toggledLeaves.add(leaf)
  }

  public toggle(key: Key) {
    const leaves = this.#groupedLeaves.get(key)
    if (!leaves?.size) return

    leaves.forEach((leaf) => {
      const _isToggled = this.toggledLeaves.has(leaf)
      leaf.toggleBy(!_isToggled)
    })
  }

  public toggleWith(keys: Key[]) {
    this.toggledLeaves.clear()
    keys.forEach((key) => {
      this.#groupedLeaves.get(key)?.forEach((leaf) => {
        this.#toggledLeaves.add(leaf)
      })
    })
  }
}

class Leaf {
  #key: Key

  #belongTo: Tree
  #parent: Nullable<Leaf>

  #children: Set<Leaf>
  #toggledChildren: Set<Leaf>

  constructor(props: LeafProps) {
    this.#key = props.key

    this.#parent = props.parent
    this.#belongTo = props.belongTo

    this.#children = new Set()
    this.#toggledChildren = new Set()

    // when leaf has grew, let tree collect leaf
    this.#belongTo.collect(this)
  }

  public get key() {
    return this.#key
  }

  public toggleBy(isToggled: boolean, isPrevent: boolean = false) {
    if (isToggled) {
      this.#belongTo.toggledLeaves.add(this)
    } else {
      this.#belongTo.toggledLeaves.delete(this)
    }

    if (isPrevent) return
    // fall to every child
    Array.from(this.#children.values()).forEach((child) => {
      child.fall(isToggled)
    })
    // rise to parent
    this.#parent?.rise(this, isToggled)
  }

  public grow(toggleableKeys: Partialable<ToggleableKey[]> = []): Leaf {
    if (toggleableKeys.length > 0) {
      toggleableKeys.forEach((_toggleableKey) => {
        const child = new Leaf({
          key: _toggleableKey.key,
          parent: this,
          belongTo: this.#belongTo
        }).grow(_toggleableKey.children)

        this.#children.add(child)
      })
    }

    return this
  }

  public rise(child: Leaf, isToggled: boolean) {
    if (isToggled) {
      this.#toggledChildren.add(child)
    } else {
      this.#toggledChildren.delete(child)
    }

    // if toggled state is same, stop
    const _isToggled = this.#children.size === this.#toggledChildren.size
    const _hasToggled = !!this.#belongTo.toggledLeaves.has(this)
    if (_hasToggled === _isToggled) return
    this.toggleBy(_isToggled, true)

    // rise to parent
    this.#parent?.rise(this, _isToggled)
  }

  public fall(isToggled: boolean) {
    // if toggled state is same, stop
    const _hasToggled = !!this.#belongTo.toggledLeaves.has(this)
    if (_hasToggled === isToggled) return
    this.toggleBy(isToggled, true)

    // fall to every child
    Array.from(this.#children.values()).forEach((child) => {
      child.fall(isToggled)
    })
  }
}

/**
 * @description
 * toggle able
 */
export const useToggleable = (toggleableKeys: ToggleableKey[], options: Options = {}) => {
  /// use once
  const _isDefaultToggled = useRef(!!options.isDefaultToggled)

  /// re-create tree when toggleable keys changed
  const tree = useMemo(() => {
    return toggleableKeys.reduce(
      (_tree, toggleable) => _tree.grow(toggleable),
      new Tree({
        isDefaultToggled: _isDefaultToggled.current
      })
    )
  }, [toggleableKeys])

  /// toggled keys
  useEffect(() => {
    if (!options.toggledKeys) return
    tree.toggleWith(options.toggledKeys)
  }, [options.toggledKeys])

  /// toggled keys
  const _toggledKeys = useMemo(() => {
    return new Set(Array.from(tree.toggledLeaves).map((leaf) => leaf.key))
  }, [tree])

  /// check current key is toggled
  const isToggled = useCallback((key: Key) => _toggledKeys.has(key), [tree])

  /// toggle one key
  const toggle = useCallback((key: Key) => tree.toggle(key), [tree])

  return {
    isAllToggled: tree.isAllToggled,
    toggledKeys: _toggledKeys,
    isToggled,
    toggle
  }
}
