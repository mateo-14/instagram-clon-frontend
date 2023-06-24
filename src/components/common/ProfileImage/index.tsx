import styles from './ProfileImage.module.css'
import React from 'react'
import Image from 'next/image'
import classNames from 'classnames'

interface ProfileImageProps {
  src?: string
  className?: string
  alt?: string
  width?: number
  height?: number
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src, className, alt = 'Profile Image', width = 26, height = 26 }) => (
  <Image src={src ?? '/default_profile.jpg'} alt="alt" width={width} height={height} className={classNames(styles.image, className)}></Image>
)

export default ProfileImage
