'use client'
import Link from 'next/link'
import ProfileImage from '../common/ProfileImage'
import styles from './FeedAside.module.css'
import useAuth from '@/hooks/useAuth'
import useSWRImmutable from 'swr/immutable'
import { getSuggestedUsers } from '@/services/usersService'
import SuggestedUser from '../common/UserCard'

export default function FeedAside (): JSX.Element {
  const { data: loggedUser } = useAuth()
  const { data: suggested } = useSWRImmutable(['users', 'suggested'], async () => await getSuggestedUsers())

  return <aside className={styles.aside}>
    {loggedUser != null &&
      <section className={styles.userCard}>
        <Link href={`/${loggedUser.username}`} prefetch={false} className={styles.userImageLink}>
          <ProfileImage
            src={loggedUser.profileImage}
            width={48}
            height={48}
          ></ProfileImage>
        </Link>
        <div>
          <Link href={`/${loggedUser.username}`} prefetch={false} className={styles.username}>
            {loggedUser.username}
          </Link>
          {(Boolean(loggedUser.displayName)) && (
            <span className={styles.displayName}>{loggedUser.displayName}</span>
          )}
        </div>
      </section>}
    <section className={styles.suggestedUsers}>
      <h2 className={styles.suggestedUsersText}>Suggestions For You</h2>
      <ul className={styles.suggestedUsers}>
        {suggested?.map(user => (
          <SuggestedUser user={user} key={user.id} />
        ))}
      </ul>
    </section>
    <section className={styles.infoText}>
      <p>
        <a
          href="https://app.swaggerhub.com/apis-docs/mateo-14/instagram-clone_api/1.0"
          target="_blank"
        >
          API
        </a>{' '}
        .{' '}
        <a href="https://github.com/mateo-14/instagram-clon-frontend" target="_blank">
          Frontend Repo
        </a>{' '}
        .{' '}
        <a href="https://github.com/mateo-14/instagram-clon-backend" target="_blank">
          Backend Repo
        </a>
      </p>
      <p>
        Made by{' '}
        <a
          href="https://mateoledesma.com"
          target="_blank"
          className={styles.authorLink}
        >
          Mateo Ledesma
        </a>
      </p>
    </section>
  </aside>
}
