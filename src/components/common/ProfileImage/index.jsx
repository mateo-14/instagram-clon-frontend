import classNames from 'classnames';
import styles from './ProfileImage.module.css';
import defaultProfile from '/default_profile.jpg';

const ProfileImage = ({ src, className, alt = 'Profile Image' }) => (
  <div className={classNames(styles.imageWrapper, className)}>
    <img src={src || defaultProfile} alt={alt} />
  </div>
);

export default ProfileImage;
