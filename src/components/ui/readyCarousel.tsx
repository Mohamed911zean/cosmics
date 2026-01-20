import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"

export function Example() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    return (
        <div className="mx-auto max-w-xs">
            <Carousel setApi={setApi} className="w-full max-w-xs">
                <CarouselContent>
                    <CarouselItem>
                        <div className="p-1">
                            <div className="flex aspect-square items-center justify-center p-6 border rounded-xl bg-ivory">
                                <span className="text-4xl font-semibold italic">1</span>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div className="p-1">
                            <div className="flex aspect-square items-center justify-center p-6 border rounded-xl bg-ivory">
                                <span className="text-4xl font-semibold italic">2</span>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div className="p-1">
                            <div className="flex aspect-square items-center justify-center p-6 border rounded-xl bg-ivory">
                                <span className="text-4xl font-semibold italic">3</span>
                            </div>
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
            <div className="text-taupe py-2 text-center text-sm">
                Slide {current} of {count}
            </div>
        </div>
    )
}