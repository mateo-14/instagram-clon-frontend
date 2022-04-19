import Button from 'components/common/Button';
import ErrorIcon from 'components/common/Icons/ErrorIcon';
import MediaIcon from 'components/common/Icons/MediaIcon';
import Loader from 'components/common/Loader';
import Modal from 'components/common/Modal';
import TextArea from 'components/common/TextArea';
import { show } from 'components/Toast';
import { useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { createPost } from 'services/postsServices';
import validateImageFile from 'src/utils/validateImageFile';
import styles from './NewPostModal.module.css';

export default function NewPostModal({ onClose }) {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const createPostMutation = useMutation(() => createPost(file, caption));
  const [caption, setCaption] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    const [file] = e.dataTransfer.files;
    if (validateImageFile(file)) setFile(file);
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const [file] = e.target.files;
    if (validateImageFile(file)) setFile(file);
  };

  const handleDiscard = () => {
    setFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || createPostMutation.isLoading) return;

    createPostMutation.mutate(null, {
      onSuccess: () => {
        onClose();
        show('Post uploaded successfully.');
      },
    });
  };

  return (
    <Modal className={styles.modal} show={true} showCloseButton={true} onClose={onClose}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create new post</h1>
      </div>

      <div className={styles.content}>
        {createPostMutation.error && (
          <div className={styles.error}>
            <ErrorIcon />
            <p className={styles.errorText}>Your post could not be shared. Please try again.</p>
          </div>
        )}
        {!file && !createPostMutation.error && (
          <div
            className={styles.uploadSection}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <MediaIcon />
            <h2 className={styles.uploadText}>Drag a photo here</h2>
            <input
              type="file"
              accept="image/png, image/jpeg"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            ></input>
            <Button onClick={handleFileClick}>Select from computer</Button>
          </div>
        )}
        {file && !createPostMutation.error && (
          <div className={styles.imageWrapper}>
            <img src={URL.createObjectURL(file)} className={styles.image}></img>
            <button className={styles.discardBtn} onClick={handleDiscard}>
              Discard photo
            </button>
            {createPostMutation.isLoading && (
              <div className={styles.uploading}>
                <Loader />
              </div>
            )}
          </div>
        )}

        <form className={styles.captionSection} onSubmit={handleSubmit}>
          <TextArea
            placeholder="Write a caption..."
            className={styles.captionTextarea}
            maxRows={4}
            disabled={createPostMutation.isLoading}
            onChange={(e) => setCaption(e.target.value)}
          />
          <Button style="text" type="submit" disabled={!file || createPostMutation.isLoading}>
            Share
          </Button>
        </form>
      </div>
    </Modal>
  );
}
