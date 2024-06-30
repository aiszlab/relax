import { type Key, useCallback, useMemo } from 'react'
import type { Nullable, Partialable } from '../types'
import { useControlledState } from './use-controlled-state'
import { useEvent } from './use-event'

/**
 * @description
 * togglable key
 */
type TogglableKey = {
  /**
   * @description
   * unique key
   */
  key: Key

  /**
   * @description
   * children
   */
  children?: TogglableKey[]
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

  public grow(togglableKey: TogglableKey) {
    // create leaf, leaf will auto trigger tree collect callback
    new Leaf({
      key: togglableKey.key,
      parent: null,
      belongTo: this
    }).grow(togglableKey.children)

    return this
  }

  public collect(leaf: Leaf) {
    this.#groupedLeaves.has(leaf.key)
      ? this.#groupedLeaves.get(leaf.key)!.add(leaf)
      : this.#groupedLeaves.set(leaf.key, new Set([leaf]))
  }

  public toggle(key: Key, toggledKeys: Set<Key>) {
    const hasToggled = toggledKeys.has(key)
    const isToggled = !hasToggled

    return this.toggleBy(key, isToggled, toggledKeys)
  }

  private toggleBy(key: Key, isToggled: boolean, toggledKeys: Set<Key>) {
    return Array.from(this.#groupedLeaves.get(key) ?? []).reduce((prev, leaf) => {
      // deep fall, add or remove child key
      // deep rise, add or remove parent key
      return leaf.rise(isToggled, leaf.fall(isToggled, prev))
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

  public grow(children: Partialable<TogglableKey[]> = []) {
    if (children.length === 0) return this

    children.forEach((node) => {
      const child = new Leaf({
        key: node.key,
        parent: this,
        belongTo: this.#belongTo
      }).grow(node.children)

      this.#children.push(child)
    })

    return this
  }

  public rise(isToggled: boolean, toggledKeys: Set<Key>): Set<Key> {
    const rised = new Set(toggledKeys)

    if (isToggled) {
      rised.add(this.#key)
    } else {
      rised.delete(this.#key)
    }

    if (this.#parent) {
      return this.#parent.rise(isToggled, rised)
    }

    return rised
  }

  public fall(isToggled: boolean, toggledKeys: Set<Key>): Set<Key> {
    return this.#children.reduce((prev, leaf) => {
      // deep loop, remove or add key
      const fell = leaf.fall(isToggled, prev)

      // toggle true, add current leaf key
      // toggle false, remove current leaf key
      if (isToggled) {
        fell.add(leaf.key)
      } else {
        fell.delete(leaf.key)
      }

      return fell
    }, new Set(toggledKeys))
  }
}

/**
 * @description
 * toggle able
 */
export const useTogglable = (togglableKeys: TogglableKey[], { onToggle, ...options }: Options = {}) => {
  /// re-create tree when togglable keys changed
  const tree = useMemo(() => {
    return togglableKeys.reduce((_tree, togglable) => {
      return _tree.grow(togglable)
    }, new Tree())
  }, [togglableKeys])

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
  const toggle = useEvent((key: Key) => {
    // get new toggled keys by toggle current key
    const _toggledKeys = Array.from(tree.toggle(key, readableToggledKeys))
    // set state
    _setToggledKeys(_toggledKeys)
    // trigger on toggle callback
    onToggle?.(_toggledKeys)
  })

  return {
    toggledKeys: readableToggledKeys,
    isToggled,
    toggle
  }
}
