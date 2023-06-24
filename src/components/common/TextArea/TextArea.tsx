import classNames from 'classnames'
import TextareaAutosize from 'react-textarea-autosize'
import styles from './TextArea.module.css'

interface TextAreaProps {
  placeholder?: string
  className?: string
  maxRows?: number
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
  disabled?: boolean
}

const TextArea: React.FC<TextAreaProps> = ({ placeholder, className, maxRows, onChange, value, disabled }) => (
  <TextareaAutosize
    className={classNames(styles.textarea, className ?? '')}
    placeholder={placeholder}
    maxRows={maxRows}
    onChange={onChange}
    value={value}
    disabled={disabled}
  ></TextareaAutosize>
)
export default TextArea
