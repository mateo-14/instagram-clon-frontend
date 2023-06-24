'use client'
import styles from './UserCard.module.css'
import { useRef } from 'react'
import { Button } from '../Button'
import Link from 'next/link'
import classNames from 'classnames'
import { type User } from '@/types/user'
import ProfileImage from '../ProfileImage'
import { useSWRConfig } from 'swr'
import { followUser, unfollowUser } from '@/services/usersService'

interface SuggestedUserProps {
  user: User
}

export default function SuggestedUser ({ user }: SuggestedUserProps): JSX.Element {
  const { mutate } = useSWRConfig()
  const abortControllerRef = useRef<AbortController | null>(null)

  function toggleFollow (): void {
    void mutate(['users', 'suggested'], async (suggestedUsers: User[] | undefined) => {
      return suggestedUsers?.map(suggestedUser => {
        if (suggestedUser.id === user.id) {
          return {
            ...suggestedUser,
            followedByClient: !(user.followedByClient ?? false)
          }
        }
        return suggestedUser
      })
    }, { revalidate: false })
  }

  const followOrUnfollow = async (): Promise<void> => {
    if (abortControllerRef.current != null) {
      abortControllerRef.current.abort()
    }
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    toggleFollow()

    try {
      if (user.followedByClient === true) {
        await unfollowUser(user.id, abortControllerRef.current.signal)
      } else {
        await followUser(user.id, abortControllerRef.current.signal)
      }
    } catch {
      if (abortController.signal.aborted) {
        return
      } else {
        toggleFollow()
      }
    }

    abortControllerRef.current = null
  }

  return (
    <li className={classNames(styles.userCard, styles.suggestedUserCard)} key={user.id}>
      <Link href={`/${user.username}`} prefetch={false} className={styles.userImageLink}>
        <ProfileImage
          src={user.profileImage}
          className={styles.suggestedUserProfileImage}
          width={32}
          height={32}
        />
      </Link>
      <div>
        <Link href={`/${user.username}`} className={styles.username} prefetch={false}>
          {user.username}
        </Link>
        {(Boolean(user.displayName)) && <span className={styles.displayName}>{user.displayName}</span>}
      </div>
      <Button
        style="text"
        className={styles.suggestedFollowBtn}
        onClick={followOrUnfollow}
      >
        {user.followedByClient === true ? 'Unfollow' : 'Follow'}
      </Button>
    </li>
  )
}
