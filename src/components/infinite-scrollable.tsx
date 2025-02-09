'use client'
import { useInterSectionObserver, type UseInterSectionObserverOptions } from '@/hooks/useIntersectionObserver'

import { ReactElement, useEffect, useState } from 'react'

/**
 * Props for the InfiniteScrollable component.
 * @template T - The type of the items to be rendered.
 */
type InfiniteScrollableProps<T> = {
  /**
   * Function to render the item with Type T.
   */
  renderItem: (item: T) => ReactElement
  /**
   * Function to fetch the items with given the page number.
   */
  fetcher: (page: number) => Promise<T[]>
  /**
   * The initial page number to fetch.
   * @default 1
   */
  initialPage?: number
  /**
   * The className for the container.
   */
  className?: string
} & UseInterSectionObserverOptions

/**
 * The InfiniteScrollable component.
 * @template T - The type of the items to be rendered.
 */
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

  // Effect hook that runs when new item is visible in viewport
  useEffect(() => {
    // If the new item is visible in viewport, increment the page number to trigger the data fetch
    if (isIntersecting) {
      setPage(page + 1)
    }
  }, [isIntersecting, page])

  // Effect hook that fetches new items when page number changes
  useEffect(() => {
    try {
      // Define async function to fetch items
      const fetchItems = async () => {
        // Call the fetcher function with current page number
        const newItems = await fetcher(page)
        // If items were returned and array is not empty
        if (newItems && newItems.length > 0) {
          // Update items state by spreading previous items and adding new ones
          setItems((prev) => [...prev, ...newItems])
        }
      }
      // Execute the fetch function
      fetchItems()
    } catch (error) {
      // Log any errors that occur during fetching
      console.error(error)
    }
  }, [fetcher, page])

  // Render the component
  return (
    // Container div with optional className passed from props
    <div className={className}>
      {/* Map through all items in state */}
      {items.map((item, index) => (
        // Wrapper div for each item with intersection ref attached to last item
        <div key={index} ref={index === items.length - 1 ? ref : null}>
          {/* Render each item using the renderItem function passed via props */}
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}
