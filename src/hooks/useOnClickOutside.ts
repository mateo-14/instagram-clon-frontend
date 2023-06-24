import { type RefObject, useEffect } from 'react'

export default function useOnClickOutside (ref: RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void, enabled: boolean, exclude: Array<React.RefObject<HTMLElement>> = []): void {
  useEffect(() => {
    if (typeof handler !== 'function' || !enabled) return

    const listener = (event: MouseEvent | TouchEvent): void => {
      if (
        (ref.current == null) ||
        ref.current.contains(event.target as Node) ||
        exclude?.some((el) => el.current?.contains(event.target as Node))
      ) {
        return
      }
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [enabled, exclude, handler, ref])
}
