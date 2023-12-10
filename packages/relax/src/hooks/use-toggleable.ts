import { Key, useCallback, useMemo, useState } from 'react'

type Dependencies = {
  keys: Key[]
  isAllDefaultToggled: boolean
}

/**
 * @description
 * toggle able
 */
export const useToggleable = ({ keys, isAllDefaultToggled }: Dependencies) => {
  const [toggledKeys, setToggledKeys] = useState<Map<Key, true>>(() => {
    if (isAllDefaultToggled) {
      return new Map(keys.map((key) => [key, true]))
    }
    return new Map()
  })

  /// toggle by flag
  const toggleBy = useCallback((key: Key, isToggled: boolean) => {
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
    return keys.length === toggledKeys.size
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
      setToggledKeys(new Map(keys.map((key) => [key, true])))
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
