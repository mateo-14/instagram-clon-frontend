import Image from 'next/image';
import styles from './ProfileImage.module.css';
import defaultProfile from '../../../../public/default_profile.jpg'

const ProfileImage = ({ src, className, alt = 'Profile Image' }) => (
  <div className={`${styles.imageWrapper} ${className ? className : ''}`}>
    <Image src={src || defaultProfile} layout="fill" alt={alt} objectFit="cover" className={styles.image} />
  </div>
);

export default ProfileImage;
