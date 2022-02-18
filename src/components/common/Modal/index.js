import classNames from 'classnames';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useRef } from 'react';
import styles from './Modal.module.css';

export default function Modal({ children, className, show, onClose, showCloseButton }) {
  const ref = useRef();
  useOnClickOutside(ref, onClose);
  return show ? (
    <div className={styles.background}>
      <div className={className} ref={ref}>
        {children}
      </div>
      {showCloseButton && (
        <button className={styles.closeButton} onClick={onClose}>
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
