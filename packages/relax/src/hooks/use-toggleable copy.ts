import { Key, useCallback, useMemo, useState } from 'react'
import { Nullable } from '../types'

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
  defaultToggled?: boolean
}

class Tree {
  #nodes: Map<Key, Node> = new Map()
}

class Node {
  #key: Key
  #isToggled: boolean
  #parent: Nullable<Node> = null

  #children: Map<Key, Node> = new Map()
  #toggledChildren: Map<Key, Node> = new Map()

  constructor(props: { key: Key; isToggled: boolean; parent: Nullable<Node> }) {
    this.#key = props.key
    this.#isToggled = props.isToggled
    this.#parent = props.parent
  }

  public get key() {
    return this.#key
  }

  public toggleBy(isToggled: boolean) {
    this.#isToggled = isToggled

    // fall to every child
    Array.from(this.#children.values()).forEach((child) => {
      child.fall(isToggled)
    })

    // rise to parent
    this.#parent?.rise(this.key, isToggled)
  }

  public toggle() {
    this.toggleBy(!this.#isToggled)
  }

  public grow(child: Node) {
    this.#children.set(child.key, child)
  }

  public rise(key: Key, isToggled: boolean) {
    const child = this.#children.get(key)
    if (!child) return

    if (isToggled) {
      this.#toggledChildren.set(key, child)
    } else {
      this.#toggledChildren.delete(key)
    }

    // if toggled state is same, stop
    const isChildrenToggled = this.#children.size === this.#toggledChildren.size
    if (this.#isToggled === isChildrenToggled) return

    // rise to parent
    this.#isToggled = isChildrenToggled
    this.#parent?.rise(this.key, isChildrenToggled)
  }

  public fall(isToggled: boolean) {
    // if toggled state is same, stop
    if (this.#isToggled === isToggled) return
    this.#isToggled = isToggled

    // fall to every child
    Array.from(this.#children.values()).forEach((child) => {
      child.fall(isToggled)
    })
  }
}

/**
 * @description
 * read toggleable key
 */
const readToggleableKeys = (toggleableKeys: ToggleableKey[], path: Key[] = []) => {
  return toggleableKeys.reduce<[ReadableToggleableKeys, ReadableKeyPaths]>(
    ([_readableToggleableKeys, _readableKeyPaths], { key, children }) => {
      // recursion, read children
      const [_keys, _paths] = children ? readToggleableKeys(children, [...path, key]) : [null, null]

      // collect current item
      _readableToggleableKeys.set(key, _keys)

      // merge key paths
      ;[...(_paths?.entries() || [])].concat([[key, [path]]]).forEach(([key, paths]) => {
        _readableKeyPaths.has(key)
          ? _readableKeyPaths.set(key, [..._readableKeyPaths.get(key)!, ...paths])
          : _readableKeyPaths.set(key, paths)
      })

      return [_readableToggleableKeys, _readableKeyPaths]
    },
    [new Map(), new Map()]
  )
}

/**
 * @description
 * toggle able
 */
export const useToggleable = (toggleableKeys: ToggleableKey[], { defaultToggled }: Options = {}) => {}
