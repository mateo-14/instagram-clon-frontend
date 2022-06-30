export class EventEmitter {
  #events = new Map()

  on(eventName, cb) {
    if (typeof cb !== 'function') return

    let listeners = this.#events.get(eventName)
    if (!listeners) {
      listeners = new Set()
      this.#events.set(eventName, listeners)
    }

    listeners.add(cb)
  }

  off(eventName, cb) {
    if (typeof cb !== 'function') return

    const listeners = this.#events.get(eventName)
    if (!listeners) return

    listeners.delete(cb)
  }

  emit(eventName, data) {
    let listeners = this.#events.get(eventName)
    if (listeners) listeners.forEach(listener => listener(data))
  }
}
