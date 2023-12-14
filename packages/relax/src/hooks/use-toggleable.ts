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

/**
 * @description
 * toggled keys
 */
type ToggledKeys = Map<Key, ToggleableKey | true>

/**
 * @description
 * readable toggleable keys
 */
type ReadableToggleableKeys = Map<Key, Nullable<ReadableToggleableKeys>>

/**
 * @description
 * readable key paths
 */
type ReadableKeyPaths = Map<Key, Key[][]>

/**
 * @description
 * read toggleable key
 */
const readToggleableKeys = (toggleableKeys: ToggleableKey[], path: Key[] = []) => {
  return toggleableKeys.reduce<[ReadableToggleableKeys, ReadableKeyPaths]>(
    ([_readableToggleableKeys, _readableKeyPaths], { key, children }) => {
      // recursion, read children
      const [_keys, _paths] = readToggleableKeys(children ?? [], [...path, key])

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
export const useToggleable = (toggleableKeys: ToggleableKey[], { defaultToggled }: Options = {}) => {
  /// read keys
  const [readableToggleableKeys, readableKeyPaths] = useMemo(() => readToggleableKeys(toggleableKeys), [toggleableKeys])

  const [toggledKeys, setToggledKeys] = useState<ToggledKeys>(() => {
    return new Map((defaultToggled ? toggleableKeys : []).map(({ key }) => [key, true]))
  })

  /// toggle by flag
  const toggleBy = useCallback((key: Key, isToggled: boolean) => {
    readableKeyPaths.get(key)?.forEach((path) => {
      path.forEach((_key) => {})
    })

    setToggledKeys((prev) => {
      if (isToggled) {
        return new Map(prev).set(key, true)
      }

      const _toggledKeys = new Map(prev)
      _toggledKeys.delete(key)
      return _toggledKeys
    })
  }, [])

  /// if all key is toggled
  const isAllToggled = useMemo(() => {
    return toggledKeys.size === keys?.length
  }, [toggledKeys, keys])

  /// is toggled
  const isToggled = useCallback(
    (key: Key) => {
      return toggledKeys.has(key)
    },
    [toggledKeys]
  )

  /// toggle
  const toggle = useCallback(
    (key: Key) => {
      toggleBy(key, !isToggled(key))
    },
    [toggleBy, isToggled]
  )

  /// toggle all
  const toggleAll = useCallback(() => {
    if (isAllToggled) {
      setToggledKeys(new Map())
    } else {
      setToggledKeys(new Map(keys?.map((key) => [key, true])))
    }
  }, [isAllToggled, keys])

  return {
    toggleBy,
    toggle,
    toggleAll,
    isToggled,
    toggledKeys,
    isAllToggled
  }
}
