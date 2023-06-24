import classNames from 'classnames'
import { type FormEvent, useState } from 'react'
import styles from './CommentForm.module.css'
import { Button } from '@/components/common/Button'
import TextArea from '@/components/common/TextArea'
import { type Post } from '@/types/post'
import { useSWRConfig } from 'swr'
import { unstable_serialize } from 'swr/infinite'
import { addComment } from '@/services/commentsService'
import { postsCommentsGetKey } from '@/utils/swrKeys'

interface CommentFormProps {
  post: Post
  className?: string
}

export default function CommentForm ({ post, className }: CommentFormProps): JSX.Element {
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isValid = value.trim().length > 0
  const { mutate } = useSWRConfig()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)

    try {
      await addComment(post.id, value)
      await mutate<Comment[][]>(unstable_serialize((index, prev) => postsCommentsGetKey(index, prev, post.id)))
      setValue('')
    } catch {

    }

    setIsSubmitting(false)
  }

  return (
    <form className={classNames(styles.commentForm, className)} onSubmit={handleSubmit}>
      <TextArea
        placeholder="Add a comment..."
        onChange={e => { setValue(e.currentTarget.value) }}
        value={value}
      />
      <Button disabled={!isValid || isSubmitting} style="text" type="submit">
        Post
      </Button>
    </form>
  )
}
