import { RefCallback, useCallback, useEffect, useRef, useState } from 'react'

/**
 *
 */
type UseInterSectionObserverOptions = {
  unobserveWhenVisible?: boolean
  options?: IntersectionObserverInit
}

type UseInterSectionObserverReturn = {
  ref: RefCallback<HTMLElement>
  isIntersecting: boolean
}

const defaultOptions: IntersectionObserverInit = {
  rootMargin: '40px'
}

const useInterSectionObserver = ({
  unobserveWhenVisible = true,
  options = defaultOptions
}: UseInterSectionObserverOptions): UseInterSectionObserverReturn => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [refTrigger, setRefTrigger] = useState(0)
  const ref = useRef<HTMLElement | null>(null)

  const refCallback: RefCallback<HTMLElement> = useCallback((element: HTMLElement) => {
    if (element) {
      ref.current = element
      setIsIntersecting(false)
      setRefTrigger(Date.now())
    }
  }, [])

  useEffect(() => {
    if (ref.current && refTrigger) {
      const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true)
            unobserveWhenVisible && observer.unobserve(entry.target)
          }
        })
      }, options)
      observer.observe(ref.current)
      return () => observer.disconnect()
    }
  }, [options, refTrigger, unobserveWhenVisible])

  return { ref: refCallback, isIntersecting }
}

export { useInterSectionObserver, type UseInterSectionObserverOptions }
