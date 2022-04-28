import { useEffect, useRef } from 'react';

export default function useInfinityScroll({ disabled, onIntersect }) {
  const targetRef = useRef();
  const rootRef = useRef();

  useEffect(() => {
    if (typeof onIntersect !== 'function' || !targetRef.current || disabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersect();
      },
      {
        root: rootRef.current,
        rootMargin: '1px',
        threshold: 1.0,
      }
    );

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [disabled]);

  return { targetRef, rootRef };
}
