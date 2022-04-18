import Button from 'components/common/Button';
import ErrorIcon from 'components/common/Icons/ErrorIcon';
import MediaIcon from 'components/common/Icons/MediaIcon';
import Loader from 'components/common/Loader';
import Modal from 'components/common/Modal';
import TextArea from 'components/common/TextArea';
import { useRef, useState } from 'react';
import { createPost } from 'services/postsServices';
import validateImageFile from "src/utils/validateImageFile";
import styles from './NewPostModal.module.css';

export default function NewPostModal({ onClose }) {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasError, setHasError] = useState(false);
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
    if (!file) return;

    setIsUploading(true);
    createPost(file, caption)
      .then((post) => {
        onClose(post);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <Modal className={styles.modal} show={true} showCloseButton={true} onClose={onClose}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create new post</h1>
      </div>

      <div className={styles.content}>
        {hasError && (
          <div className={styles.error}>
            <ErrorIcon />
            <p className={styles.errorText}>Your post could not be shared. Please try again.</p>
          </div>
        )}
        {!file && !hasError && (
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
        {file && !hasError && (
          <div className={styles.imageWrapper}>
            <img src={URL.createObjectURL(file)} className={styles.image}></img>
            <button className={styles.discardBtn} onClick={handleDiscard}>
              Discard photo
            </button>
            {isUploading && (
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
            disabled={isUploading}
            onChange={(e) => setCaption(e.target.value)}
          />
          <Button type="text" disabled={!file || isUploading}>
            Share
          </Button>
        </form>
      </div>
    </Modal>
  );
}
