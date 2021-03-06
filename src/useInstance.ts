import { useRef, useCallback, MutableRefObject } from 'react'

export default function useInstance<T extends object>(
  initial: T | (() => T),
): [T, (value: Partial<T>) => void] {
  const initialized = useRef(false)
  const ref = useRef<T>() as MutableRefObject<T>

  if (!initialized.current) {
    ref.current =
      typeof initial === 'function' ? (initial as () => T)() : initial || {}
    initialized.current = true
  }

  const update = useCallback<(value: Partial<T>) => void>(value => {
    for (let key in value) {
      // @ts-ignore
      ref.current[key] = value[key]
    }
  }, [])

  return [ref.current, update]
}
