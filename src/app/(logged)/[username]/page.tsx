'use client'
import { followUser, getUserByUsername, unfollowUser } from '@/services/usersService'
import { type User } from '@/types/user'
import { type AxiosError } from 'axios'
import useSWRImmutable from 'swr/immutable'
import styles from './profile.module.css'
import CommentIcon from '@/components/common/Icons/CommentIcon'
import HeartIcon from '@/components/common/Icons/HeartIcon'
import { Button, LinkButton } from '@/components/common/Button'
import ProfileImage from '@/components/common/ProfileImage'
import useAuth from '@/hooks/useAuth'
import classNames from 'classnames'
import { useRef } from 'react'
import useSWRInfinite from 'swr/infinite'
import { useSWRConfig } from 'swr'
import { getPost, getUserPosts } from '@/services/postsService'
import useInfinityScroll from '@/hooks/useInfinityScroll'
import Link from 'next/link'
import Image from 'next/image'
import Loader from '@/components/common/Loader'
import { userPostsGetKey } from '@/utils/swrKeys'

const MAX_POSTS_PER_PAGE = 12

function useUserPosts (username: string | null, userId: number | null): { postsIDs: number[] | undefined, isFetchingNextPage: boolean, targetRef: React.RefObject<HTMLDivElement> } {
  const { mutate } = useSWRConfig()

  const { data, size, setSize, isValidating } = useSWRInfinite<number[]>(
    (pageIndex, previousPageData) => userPostsGetKey(pageIndex, previousPageData, username),
    async (key: [string, number | null] | null) => {
      if (userId == null || username == null) return await Promise.resolve([])

      const ids: number[] = []
      const posts = await getUserPosts(userId, key?.[1])
      posts.forEach(post => {
        ids.push(post.id)
        void mutate(['posts', post.id], post, {
          revalidate: false
        })
      })
      return ids
    },
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false
    }
  )

  const { targetRef } = useInfinityScroll({
    disabled: isValidating || (data != null && data[data?.length - 1].length < MAX_POSTS_PER_PAGE),
    onIntersect: () => {
      void setSize(size + 1)
    }
  })

  return { postsIDs: data?.flat(), isFetchingNextPage: isValidating, targetRef: targetRef as React.RefObject<HTMLDivElement> }
}

interface ProfileProps {
  params: {
    username: string
  }
}

export default function Profile ({ params }: ProfileProps): JSX.Element {
  const { data: client } = useAuth(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const { data, error, mutate } = useSWRImmutable<User, AxiosError>([
    'users',
    params.username
  ], async () => await getUserByUsername(params.username))

  const { postsIDs, isFetchingNextPage, targetRef } = useUserPosts(data?.username ?? null, data?.id ?? null)

  if (error?.status === 404) {
    return <div>
      <h1>{'Sorry, this page isn\'t available.'}</h1>
      <p>
        The link you followed may be broken, or the page may have been removed. Go back to
        Instagram.
      </p>
    </div>
  }

  if (data != null && client != null) {
    const followOrUnfollow = async (): Promise<void> => {
      if (data == null) return

      if (abortControllerRef.current != null) {
        abortControllerRef.current.abort()
      }
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      void mutate({
        ...data,
        followedByClient: data.followedByClient === false,
        _count: {
          ...data._count,
          followedBy: data._count.followedBy + (data.followedByClient === false ? 1 : -1)
        }
      }, {
        revalidate: false
      })
      try {
        if (data.followedByClient === true) {
          await unfollowUser(data.id, abortControllerRef.current.signal)
        } else {
          await followUser(data.id, abortControllerRef.current.signal)
        }
      } catch (error) {
        if (abortController.signal.aborted) {
          return
        }
      }

      void mutate()
      abortControllerRef.current = null
    }
    return <>
      <section className={styles.profileInfo}>
        <ProfileImage src={data.profileImage} className={styles.image} width={144} height={144} />
        <div className={styles.mainInfo}>
          <h2 className={styles.username}>{data.username}</h2>
          {client.id === data.id
            ? null /*  (
              <LinkButton href="/a">
                Edit Profile
              </LinkButton>) */
            : (
              <Button
                onClick={followOrUnfollow}
              >
                {(data.followedByClient === true) ? 'Unfollow' : 'Follow'}
              </Button>
              )}
        </div>
        <div className={styles.displayNameBio}>
          <p className={styles.displayName}>{data.displayName}</p>
          {data.bio != null && <p className={styles.bio}>{data.bio}</p>}
        </div>
        <ul className={styles.userInfoCount}>
          <li>
            <span className={styles.infoNumber}>{data._count.posts}</span> posts
          </li>
          <li>
            <span className={styles.infoNumber}>{data._count.followedBy}</span> followers
          </li>
          <li>
            <span className={styles.infoNumber}>{data._count.following}</span> following
          </li>
        </ul>
      </section>
      <section className={styles.posts}>
        {postsIDs?.map(id => (
          <PostItem id={id} key={id} />
        ))}
      </section>
        {isFetchingNextPage && <Loader className={styles.loader} />}
      <div ref={targetRef}></div>
    </>
  }

  return <div className={classNames(styles.profileInfo, styles.skeleton)}>
    <div className={styles.image} />
    <div className={styles.mainInfo}>
      <div className={styles.skeletonName}></div>
      <div className={styles.skeletonFollowBtn}></div>
    </div>

    <div className={styles.displayNameBio}>
    </div>
    <div className={styles.userInfoCount}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
}

interface PostItemProps {
  id: number

}

function PostItem ({ id }: PostItemProps): JSX.Element {
  const { data } = useSWRImmutable(['posts', id], async ([, id]) => await getPost(id), {
    revalidateOnMount: false
  })
  return <Link href={`/posts/${id}`}>
    <div className={styles.post}>
      <div className={styles.postImage}>
        <Image src={data?.images[0] ?? ''} alt="Profile post image" width={280} height={280} />
        <ul className={styles.postInfo}>
          <li>
            <HeartIcon /> {data?._count.likes}
          </li>
          <li>
            <CommentIcon /> {data?._count.comments}
          </li>
        </ul>
      </div>
    </div>
  </Link>
}
