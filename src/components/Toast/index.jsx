import classNames from 'classnames'
import { useEffect } from 'react'
import { useState } from 'react'
import { ON_SHOW_TOAST } from 'src/events/Events'
import { eventEmitter } from 'src/main'
import { useTransition } from 'transition-hook'
import styles from './Toast.module.css'

const TRANSITION_TIMEOUT = 400
const TOAST_TIMEOUT = 5000
export function Toast() {
  const [currentText, setCurrentText] = useState(null)
  const [onOff, setOnOff] = useState(false)
  const { stage, shouldMount } = useTransition(onOff, TRANSITION_TIMEOUT)

  useEffect(() => {
    let timeout
    let timeoutRunning = false

    const showToast = text => {
      timeoutRunning = true
      setCurrentText(text)
      setOnOff(true)
      timeout = setTimeout(hideToast, TOAST_TIMEOUT)
    }

    const hideToast = () => {
      timeoutRunning = false
      setOnOff(false)
    }

    const onShowToast = text => {
      if (!timeoutRunning) {
        showToast(text)
      } else {
        clearTimeout(timeout)
        hideToast()

        setTimeout(() => {
          showToast(text)
        }, TRANSITION_TIMEOUT)
      }
    }

    eventEmitter.on(ON_SHOW_TOAST, onShowToast)
    return () => eventEmitter.off(ON_SHOW_TOAST, onShowToast)
  }, [])

  useEffect(() => {
    if (!shouldMount) {
      setCurrentText(null)
    }
  }, [shouldMount])

  return (
    currentText &&
    shouldMount && <div className={classNames(styles.toast, styles[stage])}>{currentText}</div>
  )
}
