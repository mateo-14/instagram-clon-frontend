import Modal from 'components/common/Modal';
import Post from 'components/Post';
import styles from './PostModal.module.css';
import { forwardRef } from 'react';

const PostModal = forwardRef(
  ({ post, onLikeSuccess, onCloseButtonClick, onCommentSuccess, onClickOutside }, ref) => (
    <Modal
      showCloseButton={true}
      isOpen={!!post}
      onCloseButtonClick={onCloseButtonClick}
      className={styles.modalContainer}
      ref={ref}
      onClickOutside={onClickOutside}
    >
      <Post
        data={post}
        isFullPost={true}
        onLikeSuccess={onLikeSuccess}
        onCommentSuccess={onCommentSuccess}
        ref={ref}
      />
    </Modal>
  )
);

PostModal.name = 'PostModal';
export default PostModal;
