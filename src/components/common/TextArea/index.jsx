import classNames from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './TextArea.module.css';

const TextArea = ({ placeholder, className, maxRows, onChange, value, disabled }) => (
  <TextareaAutosize
    className={classNames(styles.textarea, className || '')}
    placeholder={placeholder}
    maxRows={maxRows}
    onChange={onChange}
    value={value}
    disabled={disabled}
  ></TextareaAutosize>
);
export default TextArea;
