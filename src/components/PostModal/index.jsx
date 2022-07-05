import Modal from 'components/common/Modal'
import Post from 'components/Post'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './PostModal.module.css'

function PostModal({ post, onClose }) {
  const { pathname } = useLocation()
  const prevTitle = useRef()

  useEffect(() => {
    if (!prevTitle.current) prevTitle.current = document.title
    
    document.title = `${post?.author?.username} on InstagramClon: "${post?.text}"`
    window.history.pushState({ postId: post.id }, null, `/posts/${post.id}`)
    return () => {
      window.history.pushState(null, null, pathname)
      document.title = prevTitle.current
    }
  }, [post])

  return (
    <Modal showCloseButton={true} isOpen={true} onClose={onClose}>
      <div
        className={styles.modal}
        onMouseDown={e => (e.target === e.currentTarget ? onClose() : null)}
        role="dialog"
      >
        <Post
          data={post}
          isFullPost={true}
          classes={{
            container: styles.postContainer,
            comments: styles.comments,
            commentForm: styles.commentForm
          }}
        />
      </div>
    </Modal>
  )
}

export default PostModal
