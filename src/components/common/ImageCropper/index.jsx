import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import styles from './ImageCropper.module.css'
import { Cropper } from './Cropper'
// TODO Migrate to TypeScript
export default function ImageCropper({
  zoom = 0,
  aspectRatio = 1,
  src,
  cropperRef: cropperRefProp,
  positionRef
}) {
  const imgRef = useRef()
  const cropperElemRef = useRef()
  const cropperRef = useRef()
  const [isCropping, setIsCropping] = useState(false)

  useEffect(() => {
    const cropper = new Cropper(
      imgRef.current,
      cropperElemRef.current,
      aspectRatio,

      positionRef.current,
      {
        onCropEnd: data => {
          positionRef.current = { x: data.x, y: data.y, zoom: data.zoom }
          setIsCropping(false)
        },
        onCropStart: () => setIsCropping(true)
      }
    )
    cropperRef.current = cropper
    cropperRefProp.current = cropper
    return () => cropper.destroy()
  }, [imgRef, cropperRef])

  useEffect(() => {
    if (!cropperRef.current) return
    cropperRef.current.setAspectRatio(aspectRatio)
  }, [aspectRatio])

  useEffect(() => {
    if (!cropperRef.current) return

    const animRequest = cropperRef.current.setZoom(zoom)
    return () => cancelAnimationFrame(animRequest)
  }, [zoom])

  return (
    <div className={styles.container}>
      <div
        className={styles.cropper}
        ref={cropperElemRef}
        style={{
          aspectRatio: aspectRatio.toString(),
          width: aspectRatio >= 1 ? '100%' : 'auto',
          height: aspectRatio <= 1 ? '100%' : 'auto'
        }}
      >
        <img src={src} alt="img" className={styles.img} ref={imgRef} />
        <div className={classNames(styles.grid, { [styles.visible]: isCropping })} />
      </div>
    </div>
  )
}
