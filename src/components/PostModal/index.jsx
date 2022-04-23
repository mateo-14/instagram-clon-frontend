import Modal from 'components/common/Modal';
import Post from 'components/Post';
import styles from './PostModal.module.css';

const PostModal = ({
  post,
  onLikeSuccess,
  onCloseButtonClick,
  onCommentSuccess,
  onClickOutside,
}) => (
  <Modal
    showCloseButton={true}
    isOpen={!!post}
    onCloseButtonClick={onCloseButtonClick}
    className={styles.modalContainer}
    onClickOutside={onClickOutside}
  >
    {(outsideRef) => (
      <Post
        data={post}
        isFullPost={true}
        onLikeSuccess={onLikeSuccess}
        onCommentSuccess={onCommentSuccess}
        ref={outsideRef}
      />
    )}
  </Modal>
);

export default PostModal;
