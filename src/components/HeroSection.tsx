import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    {
        id: 1,
        title: "Timeless Radiance",
        subtitle: "Premium Skincare Collection",
        description: "Discover the secret to ageless beauty with our organically sourced serums and moisturizers.",
        image: "/elegant_skincare_hero_1766623620773.png",
        cta: "Shop Skincare"
    },
    {
        id: 2,
        title: "Luminous Artistry",
        subtitle: "Professional Makeup Line",
        description: "Express your unique style with pigments that perform and textures that feel like silk.",
        image: "/luxury_makeup_hero_1766623636272.png",
        cta: "Explore Makeup"
    },
    {
        id: 3,
        title: "Essence of Luxury",
        subtitle: "Exclusive Fragrances",
        description: "Find your signature scent among our curated collection of sophisticated, long-lasting perfumes.",
        image: "/premium_perfume_hero_1766623651238.png",
        cta: "Discover Scents"
    },
];

const variants: any = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 1.05,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            x: { type: "spring", stiffness: 200, damping: 35 } as any,
            opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        },
    },
    exit: (direction: number) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 0.95,
        transition: {
            x: { type: "spring", stiffness: 200, damping: 35 } as any,
            opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
    }),
};

const textVariants: any = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            delay: 0.4 + i * 0.15,
            duration: 1,
            ease: [0.16, 1, 0.3, 1] as any,
        },
    }),
};

export function HeroSection() {
    const [[index, direction], setIndex] = useState([0, 0]);

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 8000);
        return () => clearInterval(timer);
    }, [index]);

    const paginate = (newDirection: number) => {
        setIndex(([prev]) => {
            const nextIndex = (prev + newDirection + slides.length) % slides.length;
            return [nextIndex, newDirection];
        });
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#2F2F2F]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={index}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <motion.div
                        initial={{ scale: 1.15, filter: "brightness(0.6)" }}
                        animate={{ scale: 1, filter: "brightness(0.75)" }}
                        transition={{ duration: 12, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0"
                    >
                        <img
                            src={slides[index].image}
                            alt={slides[index].title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2F2F2F]/90 via-[#2F2F2F]/40 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 h-full flex items-center">
                        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                            <div className="max-w-3xl">
                                <motion.div
                                    custom={0}
                                    initial="hidden"
                                    animate="visible"
                                    variants={textVariants}
                                    className="inline-block mb-6"
                                >
                                    <span className="text-[#C8A165] font-ui tracking-[0.3em] uppercase text-xs font-semibold">
                                        {slides[index].subtitle}
                                    </span>
                                </motion.div>

                                <motion.h1
                                    custom={1}
                                    initial="hidden"
                                    animate="visible"
                                    variants={textVariants}
                                    className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-normal text-white leading-[0.95] mb-8 tracking-tight"
                                >
                                    {slides[index].title}
                                </motion.h1>

                                <motion.p
                                    custom={2}
                                    initial="hidden"
                                    animate="visible"
                                    variants={textVariants}
                                    className="text-lg md:text-xl text-white/50 max-w-lg leading-relaxed font-light mb-16 tracking-wide"
                                >
                                    {slides[index].description}
                                </motion.p>

                                <motion.div
                                    custom={3}
                                    initial="hidden"
                                    animate="visible"
                                    variants={textVariants}
                                >
                                    <button className="group relative inline-flex items-center gap-4 text-white font-ui text-[10px] font-bold tracking-[0.3em] uppercase overflow-hidden">
                                        <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">{slides[index].cta}</span>
                                        <div className="relative z-10 w-20 h-[1px] bg-white/20 transition-all duration-700 ease-out group-hover:w-32 group-hover:bg-[#C8A165]" />
                                        <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-all duration-500 group-hover:translate-x-3 group-hover:text-[#C8A165]" />
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Minimal Navigation */}
            <div className="absolute bottom-12 right-6 lg:right-12 z-20 flex items-center gap-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => paginate(-1)}
                        className="text-white/50 hover:text-[#C8A165] transition-colors duration-300"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    <div className="flex items-baseline gap-2 font-ui text-white">
                        <span className="text-2xl font-light">{String(index + 1).padStart(2, '0')}</span>
                        <span className="text-sm text-white/30">/</span>
                        <span className="text-sm text-white/30">{String(slides.length).padStart(2, '0')}</span>
                    </div>

                    <button
                        onClick={() => paginate(1)}
                        className="text-white/50 hover:text-[#C8A165] transition-colors duration-300"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10 z-20">
                <motion.div
                    key={index}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "linear" }}
                    className="h-full bg-[#C8A165]"
                />
            </div>
        </div>
    );
}