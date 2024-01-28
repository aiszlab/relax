import { useState, useEffect, useRef } from 'react'
import { Observable, Subscriber } from 'rxjs'

type Status = 'none' | 'loading' | 'error' | 'loaded'

interface Dependencies {
  src: string
}

/**
 * @author murukal
 *
 * @description
 * image loader
 */
export const useImageLoader = ({ src }: Dependencies) => {
  const loader = useRef<Subscriber<void>>()
  const [status, setStatus] = useState<Status>('none')

  useEffect(() => {
    if (!src) {
      return setStatus('none')
    }

    // create observable to listen img status
    new Observable<void>((subscriber) => {
      loader.current = subscriber
      subscriber.next()
    }).subscribe({
      next: () => setStatus('loading'),
      complete: () => setStatus('loaded'),
      error: () => setStatus('error')
    })

    const image = new Image()
    image.addEventListener('load', () => {
      loader.current?.complete()
    })
    image.addEventListener('error', () => {
      loader.current?.error(null)
    })
    image.src = src

    return () => {
      image.remove()
    }
  }, [src])

  return status
}
