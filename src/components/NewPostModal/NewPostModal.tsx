'use client'
import classNames from 'classnames'
import { Button } from '@/components/common/Button'
import ErrorIcon from '@/components/common/Icons/ErrorIcon'
import MediaIcon from '@/components/common/Icons/MediaIcon'
import Loader from '@/components/common/Loader'
import Modal, { ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/common/Modal'
import TextArea from '@/components/common/TextArea'
import useOnClickOutside from '@/hooks/useOnClickOutside'
import { useRef, useState } from 'react'
import { createPost } from '@/services/postsService'
import validateImageFile from '@/utils/validateImageFile'
import styles from './NewPostModal.module.css'
import Cropper from '@/components/common/ImageCropper'
import CropSquareIcon from '@/components/common/Icons/CropSquareIcon'
import CropPortraitIcon from '@/components/common/Icons/CropPortraitIcon'
import CropLandscapeIcon from '@/components/common/Icons/CropLandscapeIcon'
import CropIcon from '@/components/common/Icons/CropIcon'
import ZoomIcon from '@/components/common/Icons/ZoomIcon'
import { useSWRConfig } from 'swr'
import { usePostListsMutation } from '@/hooks/usePostsListMutation'
// import { unstable_serialize } from 'swr/infinite'
// import { feedPostsGetKey } from '@/utils/swrKeys'

interface NewPostModalProps {
  onClose: () => void
}
export default function NewPostModal ({ onClose }: NewPostModalProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)
  const [caption, setCaption] = useState<string>('')
  const [step, setStep] = useState<1 | 2>(1)
  const cropperRef = useRef<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const { mutate } = useSWRConfig()
  const { mutate: mutateList } = usePostListsMutation()

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    if (e.dataTransfer?.files == null || e.dataTransfer.files.length === 0) return

    const file = e.dataTransfer.files[0]
    if (validateImageFile(file)) setFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files == null || e.target.files.length === 0) return

    const file = e.target.files[0]
    if (validateImageFile(file)) setFile(file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if ((croppedFile == null) || isLoading) return

    setIsLoading(true)
    try {
      const post = await createPost(croppedFile, caption)
      void mutate(['posts', post.id], post, { revalidate: false })

      void mutateList((pages) => {
        if (pages == null || pages.length === 0) return pages

        const firstPage = pages[0]
        return [[post.id, ...firstPage], ...pages.slice(1)]
      }, {
        revalidate: false
      }, post.author.username)

      setIsLoading(false)
      onClose()
    } catch {
      setIsLoading(false)
      setError(true)
    }
  }

  const handleNextBack = async (): Promise<void> => {
    if (step === 1) {
      if (file == null) return
      const croppedImage = await cropperRef.current?.getCroppedImage()
      setCroppedFile(croppedImage)
      setStep(2)
    } else {
      setStep(1)
    }
  }

  return (
    <Modal showCloseButton={true} onClose={onClose}>
      <ModalContent className={styles.modal}>
        <ModalHeader>
          <h1>Create new post</h1>
          <Button style="text" className={styles.nextButton} onClick={handleNextBack}>
            {step === 1 ? 'Next' : 'Back'}
          </Button>
        </ModalHeader>
        <ModalBody className={styles.body}>
          {error && (
            <div className={styles.error}>
              <ErrorIcon className={styles.errorIcon} />
              <p className={styles.errorText}>Your post could not be shared. Please try again.</p>
            </div>
          )}
          {file == null && !error && (
            <div className={styles.upload} onDrop={handleDrop} onDragOver={e => { e.preventDefault() }}>
              <MediaIcon className={styles.mediaIcon} />
              <h2 className={styles.uploadText}>Drag a photo here</h2>
              <input
                type="file"
                accept="image/png, image/jpeg"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              ></input>
              <Button onClick={() => { fileInputRef.current?.click() }}>Select from computer</Button>
            </div>
          )}
          {file != null && !error && (
            <div className={styles.imageWrapper}>
              <ImageCropper
                image={URL.createObjectURL(file)}
                onDiscard={() => { setFile(null) }}
                hidden={step !== 1}
                cropperRef={cropperRef}
              />
              {step === 2 && croppedFile != null && (
                <img src={URL.createObjectURL(croppedFile)} className={styles.image}></img>
              )}

              {isLoading && (
                <div className={styles.uploading}>
                  <Loader className={styles.loader} />
                </div>
              )}
            </div>
          )}
        </ModalBody>
        {step === 2 && (
          <ModalFooter>
            <form className={styles.form} onSubmit={handleSubmit}>
              <TextArea
                placeholder="Write a caption..."
                className={styles.captionTextarea}
                maxRows={4}
                disabled={isLoading}
                onChange={e => { setCaption(e.target.value) }}
              />
              <Button style="text" type="submit" disabled={file == null || isLoading}>
                Share
              </Button>
            </form>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

interface ImageCropperProps {
  hidden: boolean
  image: string
  cropperRef: React.MutableRefObject<any>
  onDiscard: () => void
}

function ImageCropper ({ hidden, image, cropperRef, onDiscard }: ImageCropperProps): JSX.Element | null {
  const [zoom, setZoom] = useState(1)
  const [aspectRatio, setAspectRation] = useState<number>(1 / 1)
  const positionRef = useRef()
  if (!hidden) {
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
          <AspectRatioTool onChange={aspectRatio => { setAspectRation(aspectRatio) }} />
          <ZoomTool onChange={e => { setZoom(e.target.valueAsNumber) }} value={zoom}></ZoomTool>
          <button className={styles.discardBtn} onClick={onDiscard}>
            Discard photo
          </button>
        </div>
      </>
    )
  }

  return null
}

interface AspectRatioToolProps {
  onChange: (aspectRatio: number) => void
}

function AspectRatioTool ({ onChange }: AspectRatioToolProps): JSX.Element {
  const [aspectRatio, setAspectRatio] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLUListElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  useOnClickOutside(menuRef, () => { setIsOpen(false) }, isOpen, [buttonRef])

  const changeAspectRatio = (newAspectRatio: number): void => {
    if (aspectRatio !== newAspectRatio) {
      setAspectRatio(newAspectRatio)
      onChange(newAspectRatio)
    }
  }

  return (
    <div className={styles.aspectRatioToolWrapper}>
      {isOpen && (
        <ul className={styles.aspectRatioMenu} ref={menuRef}>
          <li>
            <button
              className={classNames({ [styles.selected]: aspectRatio === 1 })}
              onClick={() => { changeAspectRatio(1) }}
            >
              1:1
              <CropSquareIcon />
            </button>
          </li>
          <li>
            <button
              className={classNames({ [styles.selected]: aspectRatio === 4 / 5 })}
              onClick={() => { changeAspectRatio(4 / 5) }}
            >
              4:5
              <CropPortraitIcon />
            </button>
          </li>
          <li>
            <button
              className={classNames({ [styles.selected]: aspectRatio === 16 / 9 })}
              onClick={() => { changeAspectRatio(16 / 9) }}
            >
              16:9
              <CropLandscapeIcon />
            </button>
          </li>
        </ul>
      )}

      <button
        className={classNames(styles.toolsButton, { [styles.active]: isOpen })}
        onClick={() => { setIsOpen(!isOpen) }}
        ref={buttonRef}
      >
        <CropIcon />
      </button>
    </div>
  )
}

interface ZoomToolProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: number
}

function ZoomTool ({ onChange, value }: ZoomToolProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const toolRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  useOnClickOutside(toolRef, () => { setIsOpen(false) }, isOpen, [buttonRef])

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
        onClick={() => { setIsOpen(!isOpen) }}
      >
        <ZoomIcon />
      </button>
    </div>
  )
}
