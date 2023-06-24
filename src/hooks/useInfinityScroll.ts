import { useEffect, useRef } from 'react'

export default function useInfinityScroll ({ disabled, onIntersect }: { disabled: boolean, onIntersect: () => void }): { targetRef: React.RefObject<HTMLElement>, rootRef: React.RefObject<HTMLElement> } {
  const targetRef = useRef<HTMLElement>(null)
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (targetRef.current == null || disabled) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersect()
      },
      {
        root: rootRef.current,
        rootMargin: '1px',
        threshold: 1.0
      }
    )

    observer.observe(targetRef.current)
    return () => { observer.disconnect() }
  }, [disabled, onIntersect])

  return { targetRef, rootRef }
}
