'use client'

import { getFeed } from '@/services/postsService'
import useInfinityScroll from '@/hooks/useInfinityScroll'
import styles from './FeedPostList.module.css'
import useSWRInfinite from 'swr/infinite'
import Loader from '../common/Loader'
import Post from '../Post'
import { useSWRConfig } from 'swr'
import { feedPostsGetKey } from '@/utils/swrKeys'

const MAX_POSTS_PER_PAGE = 5

function useFeedPosts (): { postsIDs: number[] | undefined, isFetchingNextPage: boolean, targetRef: React.RefObject<HTMLDivElement> } {
  const { mutate } = useSWRConfig()

  const { data, size, setSize, isValidating } = useSWRInfinite<number[]>(
    feedPostsGetKey,
    async (key: [string, number | null] | null) => {
      const ids: number[] = []
      const posts = await getFeed(key?.[1])
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

export default function FeedPostList (): JSX.Element {
  const { postsIDs, targetRef, isFetchingNextPage } = useFeedPosts()

  return (
    <section className={styles.posts}>
      {postsIDs?.map(id => (
        <Post id={id} key={id} isInFeed={true} />
      ))}
      {isFetchingNextPage && <Loader className={styles.loader} />}
      <div ref={targetRef}></div>
    </section>
  )
}
