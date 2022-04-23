import useOnClickOutside from 'hooks/useOnClickOutside';
import { forwardRef, useRef, useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = forwardRef(
  ({ isOpen, showCloseButton, onCloseButtonClick, className, children, onClickOutside }, ref) => {
    const thisRef = useRef();
    useOnClickOutside(thisRef, onClickOutside, isOpen);

    useEffect(() => {
      document.body.style.overflow = isOpen ? 'hidden' : 'auto';
      return () => (document.body.style.overflow = 'auto');
    }, [isOpen]);

    return isOpen ? (
      <div className={styles.background}>
        <div className={className} ref={thisRef}>
          {children}
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
      </div>
    ) : null;
  }
);

Modal.name = 'Modal';
export default Modal;
