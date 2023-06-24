import { feedPostsGetKey, userPostsGetKey } from '@/utils/swrKeys'
import { useParams, usePathname } from 'next/navigation'
import { useSWRConfig } from 'swr'
import { type MutatorCallback, type MutatorOptions } from 'swr/_internal'
import { unstable_serialize } from 'swr/infinite'

type CustomMutator<T> = (data?: T | Promise<T> | MutatorCallback<T>, opts?: boolean | MutatorOptions<T>, username?: string) => Promise<T | undefined>

export function usePostListsMutation (): { mutate: CustomMutator<number[][]> } {
  const pathname = usePathname()
  const params = useParams()
  const { mutate } = useSWRConfig()

  const _mutate: CustomMutator<number[][]> = async (data, opts, username) => {
    let key: string | null = null
    if (pathname === '/') {
      key = unstable_serialize(feedPostsGetKey)
    } else if (params.username != null && ((username !== undefined && params.username === username) || (username === undefined))) {
      key = unstable_serialize((index, previousData) => userPostsGetKey(index, previousData, params.username))
    }
    if (key != null) {
      return await mutate<number[][]>(key, data, opts)
    }
  }

  return { mutate: _mutate }
}
