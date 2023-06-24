import { type PostPageProps } from '@/app/(logged)/posts/[id]/page'
import PostModal from '@/components/PostModal/PostModal'

export default function PostPage ({ params }: PostPageProps): JSX.Element {
  const id: number = parseInt(params.id)
  return <PostModal id={id}></PostModal>
}
