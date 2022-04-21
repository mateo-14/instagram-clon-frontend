import { useEffect } from 'react';

export default function useOnClickOutside(ref, handler, exclude = []) {
  useEffect(() => {
    if (typeof handler !== 'function') return;

    const listener = (event) => {
      if (
        !ref.current ||
        ref.current.contains(event.target) ||
        exclude.some((el) => el.current && el.current.contains(event.target))
      ) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
