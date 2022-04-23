import classNames from 'classnames';
import Button from 'components/common/Button';
import ErrorIcon from 'components/common/Icons/ErrorIcon';
import MediaIcon from 'components/common/Icons/MediaIcon';
import Loader from 'components/common/Loader';
import Modal from 'components/common/Modal';
import TextArea from 'components/common/TextArea';
import { show } from 'components/Toast';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { createPost } from 'services/postsServices';
import validateImageFile from 'src/utils/validateImageFile';
import styles from './NewPostModal.module.css';
import Cropper from 'components/common/ImageCropper';
import CropSquareIcon from 'components/common/Icons/CropSquareIcon';
import CropPortraitIcon from 'components/common/Icons/CropPortraitIcon';
import CropLandscapeIcon from 'components/common/Icons/CropLandscapeIcon';
import CropIcon from 'components/common/Icons/CropIcon';
import ZoomIcon from 'components/common/Icons/ZoomIcon';

export default function NewPostModal({ onClose }) {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const createPostMutation = useMutation(() => createPost(croppedFile, caption));
  const [caption, setCaption] = useState('');
  const [step, setStep] = useState(1);
  const cropperRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const [file] = e.dataTransfer.files;
    if (validateImageFile(file)) setFile(file);
  };

  const handleFileChange = (e) => {
    const [file] = e.target.files;
    if (validateImageFile(file)) setFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!croppedFile || createPostMutation.isLoading) return;

    createPostMutation.mutate(null, {
      onSuccess: () => {
        onClose();
        show('Post uploaded successfully.');
      },
    });
  };

  const handleNextBack = async () => {
    if (step === 1) {
      if (!file) return;
      const croppedImage = await cropperRef.current.getCroppedImage();
      setCroppedFile(croppedImage);
      setStep(2);
    } else {
      setStep(1);
    }
  };

  return (
    <Modal
      className={styles.modal}
      isOpen={true}
      showCloseButton={true}
      onCloseButtonClick={onClose}
      onClickOutside={onClose}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Create new post</h1>
        <Button style="text" className={styles.nextButton} onClick={handleNextBack}>
          {step === 1 ? 'Next' : 'Back'}
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          {createPostMutation.error && (
            <div className={styles.error}>
              <ErrorIcon className={styles.errorIcon} />
              <p className={styles.errorText}>Your post could not be shared. Please try again.</p>
            </div>
          )}
          {!file && !createPostMutation.error && (
            <div
              className={styles.upload}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <MediaIcon className={styles.mediaIcon} />
              <h2 className={styles.uploadText}>Drag a photo here</h2>
              <input
                type="file"
                accept="image/png, image/jpeg"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              ></input>
              <Button onClick={() => fileInputRef.current.click()}>Select from computer</Button>
            </div>
          )}
          {file && !createPostMutation.error && (
            <div className={styles.imageWrapper}>
              <ImageCropper
                image={URL.createObjectURL(file)}
                onDiscard={() => setFile(null)}
                hidden={step !== 1}
                cropperRef={cropperRef}
              />
              {step === 2 && (
                <img src={URL.createObjectURL(croppedFile)} className={styles.image}></img>
              )}

              {createPostMutation.isLoading && (
                <div className={styles.uploading}>
                  <Loader />
                </div>
              )}
            </div>
          )}
        </div>

        {step === 2 && (
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
        )}
      </div>
    </Modal>
  );
}

function ImageCropper({ hidden, image, cropperRef, onDiscard }) {
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRation] = useState(1 / 1);
  const positionRef = useRef();
  if (!hidden)
    return (
      <>
        <Cropper
          src={image}
          zoom={zoom}
          aspectRatio={aspectRatio}
          cropperRef={cropperRef}
          positionRef={positionRef}
        ></Cropper>
        <div className={styles.cropTools}>
          <AspectRatioTool onChange={(aspectRatio) => setAspectRation(aspectRatio)} />
          <ZoomTool onChange={(e) => setZoom(e.target.value)} value={zoom}></ZoomTool>
          <button className={styles.discardBtn} onClick={onDiscard}>
            Discard photo
          </button>
        </div>
      </>
    );

  return null;
}

function AspectRatioTool({ onChange }) {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const buttonRef = useRef();
  useOnClickOutside(menuRef, () => setIsOpen(false), isOpen, [buttonRef]);

  const changeAspectRatio = (newAspectRatio) => {
    if (aspectRatio !== newAspectRatio) {
      setAspectRatio(newAspectRatio);
      onChange(newAspectRatio);
    }
  };

  return (
    <div className={styles.aspectRatioToolWrapper}>
      {isOpen && (
        <ul className={styles.aspectRatioMenu} ref={menuRef}>
          <li>
            <button
              className={classNames({ [styles.selected]: aspectRatio === 1 })}
              onClick={() => changeAspectRatio(1)}
            >
              1:1
              <CropSquareIcon />
            </button>
          </li>
          <li>
            <button
              className={classNames({ [styles.selected]: aspectRatio === 4 / 5 })}
              onClick={() => changeAspectRatio(4 / 5)}
            >
              4:5
              <CropPortraitIcon />
            </button>
          </li>
          <li>
            <button
              className={classNames({ [styles.selected]: aspectRatio === 16 / 9 })}
              onClick={() => changeAspectRatio(16 / 9)}
            >
              16:9
              <CropLandscapeIcon />
            </button>
          </li>
        </ul>
      )}

      <button
        className={classNames(styles.toolsButton, { [styles.active]: isOpen })}
        onClick={() => setIsOpen(!isOpen)}
        ref={buttonRef}
      >
        <CropIcon />
      </button>
    </div>
  );
}

function ZoomTool({ onChange, value }) {
  const [isOpen, setIsOpen] = useState(false);
  const toolRef = useRef();
  const buttonRef = useRef();
  useOnClickOutside(toolRef, () => setIsOpen(false), isOpen, [buttonRef]);

  return (
    <div className={styles.zoomToolWrapper}>
      {isOpen && (
        <div className={styles.zoomTool} ref={toolRef}>
          <input type="range" onChange={onChange} min={1} max={2} step={0.1} value={value} />
        </div>
      )}
      <button
        className={classNames(styles.toolsButton, { [styles.active]: isOpen })}
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ZoomIcon />
      </button>
    </div>
  );
}
