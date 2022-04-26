import Modal from 'components/common/Modal';
import Post from 'components/Post';
import styles from './PostModal.module.css';

const PostModal = ({ post, onLikeSuccess, onClose, onCommentSuccess }) => (
  <Modal showCloseButton={true} isOpen={!!post} onClose={onClose}>
    <div
      className={styles.modal}
      onMouseDown={(e) => (e.target === e.currentTarget ? onClose() : null)}
      role="dialog"
    >
      <Post
        data={post}
        isFullPost={true}
        onLikeSuccess={onLikeSuccess}
        onCommentSuccess={onCommentSuccess}
      />
    </div>
  </Modal>
);

export default PostModal;
