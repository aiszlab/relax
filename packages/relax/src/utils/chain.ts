import type { Partialable } from '../utils/partial-able'

type Callable<R> = (...args: R[]) => void

export const chain = <S>(...callbacks: Partialable<Callable<S>>[]): Callable<S> => {
  return (...args) => {
    callbacks.forEach((callback) => {
      callback?.(...args)
    })
  }
}
