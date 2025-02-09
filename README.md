# Infinite Scrollable Component Example Implemented with Next.js and shadcn/ui

I built this example to show how to implement infinite scroll in an application built with Next.js and shadcn/ui.

## What's Infinite Scroll? Why would you need it?

When you need to fetch a lot of data from the server and display them, I guess pagination is the common way. But sometimes you need to display all of the data at once for some reason. In that case, infinite scroll is a good way to achieve it while keeping your application performant.

## Demo

https://shadcn-infinite-scrollable.vercel.app/

## Implementation

### Intersection Observer API

To implement infinite scroll, we need to somehow detect when the user has scrolled to the bottom of the page.
There are mainly two ways to do this:

1. **Scroll event listeners** ... Fires when the user scrolls to the bottom of the page.
2. **Intersection Observer API** ... Fires when the target element enters or exits the viewport.

I decided to go with the **Intersection Observer API** because it can be more performant than scroll event listeners.

(Unlike scroll event listeners that fire on every scroll action, the Intersection Observer API only triggers when the target element enters or exits the viewport, resulting in better performance.)

Reference: [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

### Custom Hook to use Intersection Observer API

I got inspired by a custom hook to use Intersection Observer API already implemented in [use-hooks-ts](https://usehooks-ts.com/react-hook/use-intersection-observer), and modified it to fit my needs.

```ts
import { RefCallback, useCallback, useEffect, useRef, useState } from 'react'

/**
 * The options for the Intersection Observer.
 */
type UseInterSectionObserverOptions = {
  /**
   * Whether to unobserve the element when it is visible.
   * @default true
   */
  unobserveWhenVisible?: boolean
  /**
   * The options for the Intersection Observer.
   * @see [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
   */
  options?: IntersectionObserverInit
}

/**
 * The return value of the `useInterSectionObserver` hook.
 */
type UseInterSectionObserverReturn = {
  /**
   * The ref callback for the Intersection Observer.
   */
  ref: RefCallback<HTMLElement>
  /**
   * Whether the element is intersecting.
   */
  isIntersecting: boolean
}

/**
 * Custom hook that tracks the intersection of a DOM element with its containing element or the viewport,
 * using the [`Intersection Observer API`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
 * @param {UseInterSectionObserverOptions} options - The options for the Intersection Observer.
 * @returns {UseInterSectionObserverReturn} The ref callback, a boolean indicating if the element is intersecting.
 */
const useInterSectionObserver = ({
  unobserveWhenVisible = true,
  options
}: UseInterSectionObserverOptions): UseInterSectionObserverReturn => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [refTrigger, setRefTrigger] = useState(0)
  const ref = useRef<HTMLElement | null>(null)

  /**
   * The effect to create the Intersection Observer.
   * Ensured to create the Intersection Observer every time the new element is assigned to the ref,
   * by updating the refTrigger state in the ref callback.
   */
  useEffect(() => {
    // Only proceed if we have both a valid DOM element reference AND the refTrigger is non-zero
    if (ref.current && refTrigger) {
      // Create new IntersectionObserver instance
      // It takes two parameters: callback function and options
      // The callback function receives:
      // - entries: Array of IntersectionObserverEntry objects describing the intersection changes
      // - observer: The IntersectionObserver instance, useful for manually controlling observation
      const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer) => {
        // Loop through all intersection entries (usually just one in this case)
        entries.forEach((entry) => {
          // If the element comes into view (intersects with viewport/root)
          if (entry.isIntersecting) {
            // Update state to indicate element is now visible
            setIsIntersecting(true)
            // If unobserveWhenVisible is true (default), stop observing this element.
            // This optimization prevents unnecessary observer callbacks after the initial intersection.
            // Common use cases where we want to unobserve after first visibility:
            // 1. Infinite scroll - Once we detect bottom of list, we load more items and don't need to re-trigger
            // 2. Lazy loading - Once an image/component is loaded, we don't need to monitor it anymore
            // 3. Animation triggers - For one-time entrance animations that shouldn't repeat
            unobserveWhenVisible && observer.unobserve(entry.target)
          }
        })
      }, options)

      // Start observing the DOM element
      observer.observe(ref.current)

      // Cleanup function that runs when effect is cleaned up
      // (component unmounts or dependencies change)
      return () => observer.disconnect()
    }
  }, [options, refTrigger, unobserveWhenVisible])

  /**
   * The ref callback to update the intersection state.
   * Also updating the refTrigger state to ensure the effect to create the Intersection Observer is triggered.
   * @see [Usage of ref callback](`https://react.dev/reference/react-dom/components/common#ref-callback`)
   */
  const refCallback: RefCallback<HTMLElement> = useCallback((element: HTMLElement | null) => {
    // This callback is called by React in three scenarios:
    // 1. When the ref is first attached to an element
    // 2. When the ref is moved to a different element
    // 3. When the ref is removed from an element

    // Cleanup block: Handles when element is being removed
    // Only runs if there's no new element but we had a previous reference
    if (!element && ref.current) {
      ref.current = null // Clean up the reference
      setIsIntersecting(false) // Reset intersection state since element is gone
      return // Exit early as no further processing needed
    }

    // New element block: Handles when a new element is being attached
    // Only runs if we have a new element AND it's different from current one
    if (element && element !== ref.current) {
      ref.current = element // Store the new element reference
      setIsIntersecting(false) // Reset intersection state for fresh observation
      setRefTrigger((prev) => prev + 1) // Trigger effect to create new IntersectionObserver
    }
  }, [])

  return { ref: refCallback, isIntersecting }
}

export { useInterSectionObserver, type UseInterSectionObserverOptions }
```
