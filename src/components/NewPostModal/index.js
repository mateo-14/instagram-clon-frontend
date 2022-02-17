import Button from 'components/common/Button';
import Loader from 'components/common/Loader';
import Modal from 'components/common/Modal';
import TextArea from 'components/common/TextArea';
import { useRef, useState } from 'react';
import { createPost } from 'services/postsServices';
import styles from './NewPostModal.module.css';

const validateFile = (file) => /image\/jpeg|png/.test(file.type);

export default function NewPostModal({ onClose }) {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const [file] = e.dataTransfer.files;
    if (validateFile(file)) setFile(file);
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const [file] = e.target.files;
    if (validateFile(file)) setFile(file);
  };

  const handleDiscard = () => {
    setFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    createPost(file, 'anashe')
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
            <svg
              aria-label="Something went wrong. Please try again."
              color="#262626"
              fill="#262626"
              height="96"
              role="img"
              viewBox="0 0 96 96"
              width="96"
            >
              <path d="M48 0c26.5 0 48 21.5 48 48S74.5 96 48 96 0 74.5 0 48 21.5 0 48 0zm0 2C22.6 2 2 22.6 2 48s20.6 46 46 46 46-20.6 46-46S73.4 2 48 2zm0 57.8c3.4 0 6.1 2.7 6.1 6.1 0 3.4-2.7 6.1-6.1 6.1s-6.1-2.7-6.1-6.1c0-3.3 2.7-6.1 6.1-6.1zm0 2c-2.3 0-4.1 1.8-4.1 4.1S45.7 70 48 70s4.1-1.8 4.1-4.1c0-2.2-1.8-4.1-4.1-4.1zM48 23c3.5 0 6.4 2.8 6.1 6.2l-1.6 22.5c-.2 2.3-2.2 4-4.5 4-2.4 0-4.4-1.7-4.5-4l-1.6-22.5c-.3-3.4 2.6-6.2 6.1-6.2zm0 2c-2.4 0-4.3 1.9-4.1 4l1.6 22.5c.1 1.2 1.2 2.1 2.5 2.1s2.4-.9 2.5-2.1L52.1 29c.2-2.1-1.7-4-4.1-4z"></path>
            </svg>
            <p className={styles.errorText}>Your post could not be shared. Please try again.</p>
          </div>
        )}
        {!file && !hasError && (
          <div
            className={styles.uploadSection}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <svg
              aria-label="Icon to represent media such as images or videos"
              color="#262626"
              fill="#262626"
              height="77"
              role="img"
              viewBox="0 0 97.6 77.3"
              width="96"
            >
              <path
                d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                fill="currentColor"
              ></path>
              <path
                d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                fill="currentColor"
              ></path>
              <path
                d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                fill="currentColor"
              ></path>
            </svg>
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

        <form
          className={`${styles.captionSection} ${hasError || isUploading ? styles.hidden : ''}`}
          onSubmit={handleSubmit}
        >
          <TextArea
            placeholder="Write a caption..."
            className={styles.captionTextarea}
            maxRows={4}
            disabled={isUploading}
          />
          <Button type="text" disabled={!file || isUploading}>
            Share
          </Button>
        </form>
      </div>
    </Modal>
  );
}
