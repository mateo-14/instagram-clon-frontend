'use client'
import Modal from '@/components/common/Modal'
import Post from '@/components/Post'
import styles from './PostModal.module.css'
import { useRouter } from 'next/navigation'
import classNames from 'classnames'
import { useEffect } from 'react'

interface PostModalProps {
  id: number
}

export default function PostModal ({ id }: PostModalProps): JSX.Element {
  const router = useRouter()
  const handleClose = (): void => {
    router.back()
  }

  return (
    <Modal showCloseButton={true} onClose={handleClose}>
      <div
        className={classNames(styles.modal, 'in-modal')}
        onMouseDown={e => {
          if (e.target === e.currentTarget) handleClose()
        }}
        role="dialog"
      >
        <Post
          id={id}
          classes={{
            container: styles.postContainer,
            comments: styles.comments,
            commentForm: styles.commentForm
          }}
          inModal={true}
        />
      </div>
    </Modal>

  )
}
