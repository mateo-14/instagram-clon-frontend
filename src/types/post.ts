import { type User } from './user'

export interface Post {
  id: number
  createdAt: string
  images: string[]
  author: User
  text: string
  _count: {
    likes: number
    comments: number
  }
  hasClientLike: boolean
}
