import styles from './Loader.module.css'
import classNames from 'classnames'

const Loader = ({ className }) => <div className={classNames(styles.loader, className)}></div>

export default Loader
