'use client'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import HeartIcon from '../Icons/HeartIcon'
import OutlineHeartIcon from '../Icons/OutlineHeartIcon'
import styles from './LikeButton.module.css'

interface LikeButtonProps {
  onClick: () => void
  hasClientLike: boolean
  className?: string
}

export default function LikeButton ({ onClick, hasClientLike, className }: LikeButtonProps): JSX.Element {
  const [animate, setAnimate] = useState(false)

  const handleClick = (): void => {
    onClick()
    setAnimate(true)
  }

  useEffect(() => {
    if (!hasClientLike) {
      setAnimate(true)
    }
  }, [])

  return <button
    className={classNames(styles.action, className, {
      liked: hasClientLike
    })}
    onClick={handleClick}
  >
    {hasClientLike
      ? <HeartIcon className={classNames({
        [styles.likeButtonIcon]: animate
      })} />
      : <OutlineHeartIcon />}
  </button>
}
