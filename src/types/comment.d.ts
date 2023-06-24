import { type Post } from './post'
import { type User } from './user'

interface Comment {
  id: number
  postId: Post['id']
  createdAt: string
  text: string
  author: Pick<User, 'id' | 'username' | 'profileImage'>
  _count: {
    likes: number
    replies: number
  }
  hasClientLike: boolean
  commentRepliedId?: number
}
