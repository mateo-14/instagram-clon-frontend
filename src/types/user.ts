export interface User {
  id: number
  bio?: string
  username: string
  displayName?: string
  profileImage: string
  _count: {
    posts: number
    followedBy: number
    following: number
  }
  isTestAccount?: boolean
  followedByClient?: boolean
}
