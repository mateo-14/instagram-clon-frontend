import classNames from 'classnames';
import Button from 'components/common/Button';
import ErrorIcon from 'components/common/Icons/ErrorIcon';
import MediaIcon from 'components/common/Icons/MediaIcon';
import Loader from 'components/common/Loader';
import Modal from 'components/common/Modal';
import TextArea from 'components/common/TextArea';
import { show } from 'components/Toast';
import useOnClickOutside from 'hooks/useOnClickOutside';
import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react';
import Cropper from 'react-easy-crop';
import { useMutation } from 'react-query';
import { createPost } from 'services/postsServices';
import getCroppedImg from 'src/utils/cropImage';
import validateImageFile from 'src/utils/validateImageFile';
import styles from './NewPostModal.module.css';

export default function NewPostModal({ onClose }) {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const createPostMutation = useMutation(() => createPost(croppedFile, caption));
  const [caption, setCaption] = useState('');
  const [step, setStep] = useState(1);
  const croppedAreaPixels = useRef(null);

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
      const croppedImage = await getCroppedImg(
        URL.createObjectURL(file),
        croppedAreaPixels.current
      );
      setCroppedFile(croppedImage);
      setStep(2);
    } else {
      setStep(1);
    }
  };

  return (
    <Modal className={styles.modal} show={true} showCloseButton={true} onClose={onClose}>
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
              <ErrorIcon />
              <p className={styles.errorText}>Your post could not be shared. Please try again.</p>
            </div>
          )}
          {!file && !createPostMutation.error && (
            <div
              className={styles.upload}
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
              <ImageCropper
                image={URL.createObjectURL(file)}
                croppedAreaPixels={croppedAreaPixels}
                onDiscard={() => setFile(null)}
                hidden={step !== 1}
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

function ImageCropper({ hidden, image, croppedAreaPixels, onDiscard }) {
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState(1);
  const cropperRef = useRef();
  const [aspectRatio, setAspectRation] = useState(1 / 1);
  const [objectFit, setObjectFit] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const onCropComplete = useCallback((_, newCroppedAreaPixels) => {
    croppedAreaPixels.current = newCroppedAreaPixels;
  }, []);

  const handleAspectRatioChange = (newAspectRatio) => {
    if (newAspectRatio === 2) setAspectRation(4 / 5);
    else if (newAspectRatio === 3) setAspectRation(16 / 9);
    else setAspectRation(1);
  };

  useLayoutEffect(() => {
    const img = cropperRef.current?.imageRef;
    if (img) {
      img.onload = (e) => {
        cropperRef.current.containerRef.style.visibility = 'hidden';
        setObjectFit(img.naturalWidth > img.naturalHeight ? 'vertical-cover' : 'horizontal-cover');
        cropperRef.current.imageRef.onload = null;
        cropperRef.current.computeSizes();
        setTimeout(() => (cropperRef.current.containerRef.style.visibility = null), 200);
      };
    }
  }, [cropperRef]);

  if (!hidden)
    return (
      <>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          zoomWithScroll={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          onInteractionStart={() => setIsInteracting(true)}
          onInteractionEnd={() => setIsInteracting(false)}
          objectFit={objectFit}
          ref={cropperRef}
          style={{
            mediaStyle: {
              transition: 'transform .15s, opacity 1s',
              opacity: objectFit ? '1' : '0.5',
            },
            cropAreaStyle: {
              borderWidth: isInteracting ? '1px' : 0,
              transition: 'width .2s, height .2s',
            },
          }}
          showGrid={isInteracting}
        ></Cropper>
        <div className={styles.cropTools}>
          <AspectRatioTool onChange={handleAspectRatioChange} />
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
  useOnClickOutside(menuRef, () => setIsOpen(false), [buttonRef]);

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
              <svg
                aria-label="Crop Square Icon"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M19 23H5a4.004 4.004 0 01-4-4V5a4.004 4.004 0 014-4h14a4.004 4.004 0 014 4v14a4.004 4.004 0 01-4 4zM5 3a2.002 2.002 0 00-2 2v14a2.002 2.002 0 002 2h14a2.002 2.002 0 002-2V5a2.002 2.002 0 00-2-2z"></path>
              </svg>
            </button>
          </li>
          <li>
            <button
              className={classNames({ [styles.selected]: aspectRatio === 2 })}
              onClick={() => changeAspectRatio(2)}
            >
              4:5
              <svg
                aria-label="Crop Portrait Icon"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M16 23H8a4.004 4.004 0 01-4-4V5a4.004 4.004 0 014-4h8a4.004 4.004 0 014 4v14a4.004 4.004 0 01-4 4zM8 3a2.002 2.002 0 00-2 2v14a2.002 2.002 0 002 2h8a2.002 2.002 0 002-2V5a2.002 2.002 0 00-2-2z"></path>
              </svg>
            </button>
          </li>
          <li>
            <button
              className={classNames({ [styles.selected]: aspectRatio === 3 })}
              onClick={() => changeAspectRatio(3)}
            >
              16:9
              <svg
                aria-label="Crop Landscape Icon"
                color="currentColor"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M19 20H5a4.004 4.004 0 01-4-4V8a4.004 4.004 0 014-4h14a4.004 4.004 0 014 4v8a4.004 4.004 0 01-4 4zM5 6a2.002 2.002 0 00-2 2v8a2.002 2.002 0 002 2h14a2.002 2.002 0 002-2V8a2.002 2.002 0 00-2-2z"></path>
              </svg>
            </button>
          </li>
        </ul>
      )}

      <button
        className={classNames(styles.toolsButton, { [styles.active]: isOpen })}
        onClick={() => setIsOpen(!isOpen)}
        ref={buttonRef}
      >
        <svg
          aria-label="Select Crop"
          fill="currentColor"
          height="16"
          role="img"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M10 20H4v-6a1 1 0 00-2 0v7a1 1 0 001 1h7a1 1 0 000-2zM20.999 2H14a1 1 0 000 2h5.999v6a1 1 0 002 0V3a1 1 0 00-1-1z"></path>
        </svg>
      </button>
    </div>
  );
}

function ZoomTool({ onChange, value }) {
  const [isOpen, setIsOpen] = useState(false);
  const toolRef = useRef();
  const buttonRef = useRef();
  useOnClickOutside(toolRef, () => setIsOpen(false), [buttonRef]);

  return (
    <div className={styles.zoomToolWrapper}>
      {isOpen && (
        <div className={styles.zoomTool} ref={toolRef}>
          <input type="range" onChange={onChange} min={1} max={3} step={0.1} value={value} />
        </div>
      )}
      <button
        className={classNames(styles.toolsButton, { [styles.active]: isOpen })}
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          aria-label="Select Zoom"
          fill="currentColor"
          height="16"
          role="img"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M22.707 21.293l-4.825-4.825a9.519 9.519 0 10-1.414 1.414l4.825 4.825a1 1 0 001.414-1.414zM10.5 18.001a7.5 7.5 0 117.5-7.5 7.509 7.509 0 01-7.5 7.5zm3.5-8.5h-2.5v-2.5a1 1 0 10-2 0v2.5H7a1 1 0 100 2h2.5v2.5a1 1 0 002 0v-2.5H14a1 1 0 000-2z"></path>
        </svg>
      </button>
    </div>
  );
}
