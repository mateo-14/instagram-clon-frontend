import useOnClickOutside from 'hooks/useOnClickOutside';
import { useRef, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

function createWrapper(id) {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('id', id);
  document.body.appendChild(wrapper);
  return wrapper;
}

export default function Modal({
  isOpen,
  showCloseButton,
  onCloseButtonClick,
  className,
  children,
  onClickOutside,
}) {
  const wrapperId = useId();
  const [wrapper, setWrapper] = useState();
  const ref = useRef();
  useOnClickOutside(ref, onClickOutside, isOpen);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);


  useEffect(() => {
    let element = document.getElementById(`modal-${wrapperId}`);
    if (!element) element = createWrapper(`modal-${wrapperId}`);
    setWrapper(element);
    return () => element.remove();
  }, []);

  return isOpen && wrapper
    ? createPortal(
        <div className={styles.background}>
          <div className={className} ref={typeof children !== 'function' ? ref : null}>
            {typeof children === 'function' ? children(ref) : children}
          </div>
          {showCloseButton && (
            <button className={styles.closeButton} onClick={onCloseButtonClick}>
              <svg aria-label="Close" viewBox="0 0 24 24" color="currentColor">
                <polyline
                  fill="none"
                  points="20.643 3.357 12 12 3.353 20.647"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                ></polyline>
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  x1="20.649"
                  x2="3.354"
                  y1="20.649"
                  y2="3.354"
                ></line>
              </svg>
            </button>
          )}
        </div>,
        wrapper
      )
    : null;
}
