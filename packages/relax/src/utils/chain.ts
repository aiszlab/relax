import type { Partialable } from '@aiszlab/tatoba'

type Callable<R> = (...args: R[]) => void

export const chain = <S>(...callbacks: Partialable<Callable<S>>[]): Callable<S> => {
  return (...args) => {
    callbacks.forEach((callback) => {
      callback?.(...args)
    })
  }
}
