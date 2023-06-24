import { useState, useEffect } from 'react'
import { Subject } from 'rxjs'

type Status = 'none' | 'loading' | 'error' | 'loaded'

interface Dependencies {
  src: string
}

export const useImageLoader = ({ src }: Dependencies) => {
  const [status, setStatus] = useState<Status>('none')

  useEffect(() => {
    if (!src) {
      return setStatus('none')
    }

    setStatus('loading')

    const $loader = new Subject<void>()
    $loader.subscribe({
      complete: () => setStatus('loaded'),
      error: () => setStatus('error')
    })

    const image = new Image()
    image.addEventListener('load', () => {
      $loader.complete()
    })
    image.addEventListener('error', () => {
      $loader.error(null)
    })
    image.src = src
  }, [src])

  return status
}
