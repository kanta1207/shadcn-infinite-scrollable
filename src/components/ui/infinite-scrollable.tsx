'use client'
import { useInterSectionObserver, type UseInterSectionObserverOptions } from '@/hooks/useIntersectionObserver'

import { ReactElement, useEffect, useState } from 'react'

type InfiniteScrollableProps<T> = {
  renderItem: (item: T) => ReactElement
  fetcher: (page: number) => Promise<T[]>
  initialPage?: number
  className?: string
} & UseInterSectionObserverOptions

export const InfiniteScrollable = <T,>({
  renderItem,
  fetcher,
  initialPage = 1,
  className,
  ...props
}: InfiniteScrollableProps<T>) => {
  const { ref, isIntersecting } = useInterSectionObserver(props)
  const [page, setPage] = useState(initialPage)
  const [items, setItems] = useState<T[]>([])

  useEffect(() => {
    if (isIntersecting) {
      setPage(page + 1)
    }
  }, [isIntersecting, page])

  useEffect(() => {
    const fetchItems = async () => {
      const newItems = await fetcher(page)
      if (newItems && newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems])
      }
    }
    fetchItems()
  }, [fetcher, page])

  return (
    <div className={className}>
      {items.map((item, index) =>
        index === items.length - 1 ? (
          <div key={index} ref={ref}>
            {renderItem(item)}
          </div>
        ) : (
          <div key={index}>{renderItem(item)}</div>
        )
      )}
    </div>
  )
}
