import { Key, useCallback, useState } from 'react'

type Dependencies = {
  keys: Key[]
}

/**
 * @description
 * checkable
 */
export const useCheckable = ({ keys }: Dependencies) => {
  const [checkedKeys, setCheckedKeys] = useState<Map<Key, true>>(new Map())

  /// check handler
  const check = useCallback((key: Key, isChecked: boolean) => {
    setCheckedKeys((prev) => {
      if (isChecked) {
        return new Map(prev).set(key, true)
      }

      const _checkedKeys = new Map(prev)
      _checkedKeys.delete(key)
      return _checkedKeys
    })
  }, [])

  /// is check all
  const isAllChecked = useCallback(() => {
    return keys.length === checkedKeys.size
  }, [checkedKeys, keys])

  /// is checked
  const isChecked = useCallback(
    (key: Key) => {
      return checkedKeys.has(key)
    },
    [checkedKeys]
  )

  /// toggle
  const toggle = useCallback(
    (key: Key) => {
      check(key, !isChecked(key))
    },
    [check, isChecked]
  )

  /// check all
  const checkAll = useCallback(() => {
    if (isAllChecked()) {
      setCheckedKeys(new Map())
    } else {
      setCheckedKeys(new Map(keys.map((key) => [key, true])))
    }
  }, [isAllChecked, keys])

  return {
    check,
    toggle,
    isChecked,
    isAllChecked,
    checkAll,
    checkedKeys
  }
}
