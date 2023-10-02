import { EffectCallback, useLayoutEffect } from 'react'

/**
 * @author murukal
 *
 * @description
 * when components will mount
 */
export const useMount = (callable: EffectCallback | UnderlyingSinkCloseCallback) => {
  useLayoutEffect(() => {
    const called = callable()

    // if result is void
    if (!called) {
      return void 0
    }

    // if result is promise like, return void
    if ((called as PromiseLike<void>).then) {
      return void 0
    }

    return called as VoidFunction
  }, [])
}
