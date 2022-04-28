import classNames from 'classnames';
import { forwardRef, useEffect, useId, useState } from "react";
import { createPortal } from 'react-dom';
import CloseIcon from '../Icons/CloseIcon';
import styles from './Modal.module.css';

function createWrapper(id) {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('id', id);
  document.body.appendChild(wrapper);
  return wrapper;
}

export default function Modal({ isOpen, showCloseButton, onClose, children }) {
  const wrapperId = useId();
  const [wrapper, setWrapper] = useState();
  

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
        <div
          className={styles.background}
          onMouseDown={(e) => (e.target === e.currentTarget ? onClose() : null)}
        >
          {children}
          {showCloseButton && <CloseButton onClick={onClose} />}
        </div>,
        wrapper
      )
    : null;
}

export const ModalContent = ({ children, className, showCloseButton, onClose }) => (
  <section className={classNames(styles.content, className)} role="dialog">
    {children}
    {showCloseButton && <CloseButton onClick={onClose} />}
  </section>
);

export const ModalHeader = ({ children }) => <header className={styles.header}>{children}</header>;

export const ModalBody = forwardRef(({ children, className }, ref) => (
  <div className={classNames(styles.body, className)} ref={ref}>
    {children}
  </div>
));

ModalBody.name = 'ModalBody';

export const ModalFooter = ({ children, className }) => (
  <footer className={classNames(styles.footer, className)}>{children}</footer>
);

const CloseButton = ({ onClick }) => (
  <button className={styles.closeButton} onClick={onClick}>
    <CloseIcon />
  </button>
);
