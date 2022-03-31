import Modal from 'components/common/Modal';
import Post from 'components/Post';
import styles from './PostModal.module.css';

export default function PostModal({ post, onLikeSuccess, onClose, onCommentSuccess }) {
  return (
    <Modal showCloseButton={true} show={!!post} onClose={onClose} className={styles.modalContainer}>
      <Post
        data={post}
        isFullPost={true}
        onLikeSuccess={onLikeSuccess}
        onCommentSuccess={onCommentSuccess}
      />
    </Modal>
  );
}
