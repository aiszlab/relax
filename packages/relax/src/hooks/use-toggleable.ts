import { Key, useCallback, useEffect, useMemo } from 'react'
import { Nullable } from '../utils/null-able'
import { Partialable } from '../utils/partial-able'
import { useControlledState } from './use-controlled-state'

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

  /**
   * @description
   * on toggle callback
   */
  onToggle?: (keys: Key[]) => void
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
  #groupedLeaves: Map<Key, Set<Leaf>>

  constructor() {
    this.#groupedLeaves = new Map()
  }

  get groupedLeaves() {
    return this.#groupedLeaves
  }

  public grow(toggleableKey: ToggleableKey) {
    // create leaf, leaf will auto trigger tree collect callback
    new Leaf({
      key: toggleableKey.key,
      parent: null,
      belongTo: this
    }).grow(toggleableKey.children)

    return this
  }

  public collect(leaf: Leaf) {
    this.#groupedLeaves.has(leaf.key)
      ? this.#groupedLeaves.set(leaf.key, new Set([leaf]))
      : this.#groupedLeaves.get(leaf.key)!.add(leaf)
  }

  public toggle(key: Key, toggledKeys: Set<Key>) {
    const hasToggled = toggledKeys.has(key)
    const _isToggled = !hasToggled

    return this.toggleBy(key, _isToggled, toggledKeys)
  }

  private toggleBy(key: Key, isToggled: boolean, toggledKeys: Set<Key>) {
    return Array.from(this.#groupedLeaves.get(key) ?? []).reduce((prev, leaf) => {
      // deep fall, add or remove child key
      const fell = leaf.fall(isToggled, prev)

      // deep rise, add or remove parent key
      const rised = leaf.rise(fell)

      return rised
    }, new Set(toggledKeys))
  }
}

class Leaf {
  #key: Key

  #belongTo: Tree
  #parent: Nullable<Leaf>

  #children: Leaf[]

  constructor(props: LeafProps) {
    this.#key = props.key

    this.#parent = props.parent
    this.#belongTo = props.belongTo

    this.#children = []

    // when leaf has grew, let tree collect leaf
    this.#belongTo.collect(this)
  }

  public get key() {
    return this.#key
  }

  public grow(toggleableKeys: Partialable<ToggleableKey[]> = []) {
    if (toggleableKeys.length > 0) {
      toggleableKeys.forEach((_toggleableKey) => {
        const child = new Leaf({
          key: _toggleableKey.key,
          parent: this,
          belongTo: this.#belongTo
        }).grow(_toggleableKey.children)

        this.#children.push(child)
      })
    }
    return this
  }

  public rise(toggledKeys: Set<Key>): Set<Key> {
    // if current key is toggled or children is all toggled
    // just add current key into toggled keys
    // else remove current key
    const isToggled = toggledKeys.has(this.#key) || this.#children.every((child) => toggledKeys.has(child.key))
    const rised = new Set(toggledKeys)

    if (isToggled) {
      rised.add(this.#key)
    } else {
      rised.delete(this.#key)
    }

    if (this.#parent) {
      return this.#parent.rise(rised)
    }
    return rised
  }

  public fall(isToggled: boolean, toggledKeys: Set<Key>): Set<Key> {
    return this.#children.reduce((prev, leaf) => {
      // deep loop, remove or add key
      const fell = leaf.fall(isToggled, prev)

      // toggle true, add key
      // toggle false, remove key
      if (isToggled) {
        fell.add(this.#key)
      } else {
        fell.delete(this.#key)
      }

      return fell
    }, new Set(toggledKeys))
  }
}

/**
 * @description
 * toggle able
 */
export const useToggleable = (toggleableKeys: ToggleableKey[], { onToggle, ...options }: Options = {}) => {
  /// re-create tree when toggleable keys changed
  const tree = useMemo(() => {
    return toggleableKeys.reduce((_tree, toggleable) => {
      return _tree.grow(toggleable)
    }, new Tree())
  }, [toggleableKeys])

  /// use controlled state to record toggled keys
  const [_toggledKeys, _setToggledKeys] = useControlledState(options.toggledKeys!, {
    defaultState: () => {
      return options.isDefaultToggled
        ? Array.from(
            Array.from(tree.groupedLeaves.values()).reduce<Set<Key>>((prev, leaves) => {
              leaves.forEach((leaf) => prev.add(leaf.key))
              return prev
            }, new Set())
          )
        : []
    }
  })

  /// use set for toggled keys to make it read-only
  const readableToggledKeys = useMemo(() => new Set(_toggledKeys), [_toggledKeys])

  /// check current key is toggled
  const isToggled = useCallback(
    (key: Key) => !readableToggledKeys || readableToggledKeys.has(key),
    [readableToggledKeys]
  )

  /// toggle one key
  const toggle = useCallback(
    (key: Key) => {
      // get new toggled keys by toggle current key
      const _toggledKeys = Array.from(tree.toggle(key, readableToggledKeys))
      // set state
      _setToggledKeys(_toggledKeys)
      // trigger on toggle callback
      onToggle?.(_toggledKeys)
    },
    [tree, readableToggledKeys, _setToggledKeys, onToggle]
  )

  return {
    toggledKeys: readableToggledKeys,
    isToggled,
    toggle
  }
}
