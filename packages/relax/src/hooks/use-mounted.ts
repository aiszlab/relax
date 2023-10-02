import { EffectCallback, useEffect } from 'react'

/**
 * @author murukal
 *
 * @description
 * when components mounted
 */
export const useMounted = (callable: EffectCallback | UnderlyingSinkCloseCallback) => {
  useEffect(() => {
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
