import { useEffect, useState, useRef, type RefObject } from 'react'

interface UseInViewOptions extends IntersectionObserverInit {
    triggerOnce?: boolean
}

export function useInView(options: UseInViewOptions = {}): [RefObject<HTMLDivElement | null>, boolean] {
    const [isInView, setIsInView] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true)
                if (options.triggerOnce !== false) {
                    observer.unobserve(entry.target)
                }
            }
        }, options)

        const currentRef = ref.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [options])

    return [ref, isInView]
}
