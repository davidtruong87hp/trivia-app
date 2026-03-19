import { useCallback, useEffect, useRef, useState } from 'react'

interface UseTimerOptions {
  duration: number
  onExpire: () => void
  enabled: boolean
}

export function useTimer({ duration, onExpire, enabled }: UseTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const onExpireRef = useRef(onExpire)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const enabledRef = useRef(enabled)

  // Keep callback ref fresh without restarting the timer
  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    // clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setTimeLeft(duration)
    // restart if currently enabled
    if (enabledRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            onExpireRef.current()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }, [duration])

  useEffect(() => {
    enabledRef.current = enabled

    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          onExpireRef.current()
          return 0
        }

        return prev - 1
      })
    }, 1000)
  }, [enabled])

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  const percentage = (timeLeft / duration) * 100

  const color =
    percentage > 50 ? '#00E5FF' : percentage > 25 ? '#FFB300' : '#FF1744'

  return {
    timeLeft,
    percentage,
    color,
    reset,
    stop,
  }
}
