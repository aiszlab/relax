import { type FC, memo } from 'react'

type Component<P> = FC<P>

export const onceBy = <P extends object>(component: Component<P>, picks: (keyof P)[]) => {
  return memo(component, (prev, next) => {
    // use map to improve performance
    const _picks = picks.reduce((prev, pick) => prev.set(pick, true), new Map<keyof P, true>())

    // if current key in picks, then return true, component will not be re-rendered
    // otherwise, check if the value is the same
    // if the value is the same, then return true, component will not be re-rendered
    // otherwise, return false, component will be re-rendered
    return ([...new Set([...Object.keys(prev), ...Object.keys(next)])] as (keyof P)[]).every((propertyKey) => {
      return !!_picks.get(propertyKey) || prev[propertyKey] === next[propertyKey]
    })
  })
}
