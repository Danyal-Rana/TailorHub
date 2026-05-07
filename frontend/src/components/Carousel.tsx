import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
    images: string[];
    autoSlide?: boolean;
    autoSlideInterval?: number;
    className?: string;
}

export const Carousel = ({ images, autoSlide = false, autoSlideInterval = 3000, className }: CarouselProps) => {
    const [curr, setCurr] = useState(0);

    const prev = () => setCurr((curr) => (curr === 0 ? images.length - 1 : curr - 1));
    const next = () => setCurr((curr) => (curr === images.length - 1 ? 0 : curr + 1));

    useEffect(() => {
        if (!autoSlide) return;
        const slideInterval = setInterval(next, autoSlideInterval);
        return () => clearInterval(slideInterval);
    }, [autoSlide, autoSlideInterval, images.length]);

    return (
        <div className={`overflow-hidden relative group w-full ${className || 'rounded-xl shadow-lg h-64 md:h-80 lg:h-96'}`}>
            <div
                className="flex transition-transform ease-out duration-500 h-full"
                style={{ transform: `translateX(-${curr * 100}%)` }}
            >
                {images.map((img, i) => (
                    <img key={i} src={img} alt={`Slide ${i}`} className="w-full h-full object-cover flex-shrink-0" />
                ))}
            </div>

            {/* Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4 transform opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={prev}
                    className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white transition-all"
                >
                    <ChevronLeft size={30} />
                </button>
                <button
                    onClick={next}
                    className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white transition-all"
                >
                    <ChevronRight size={30} />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-4 right-0 left-0">
                <div className="flex items-center justify-center gap-2">
                    {images.map((_, i) => (
                        <div
                            key={i}
                            className={`
              transition-all w-3 h-3 bg-white rounded-full
              ${curr === i ? "p-2 opacity-100" : "bg-opacity-50"}
            `}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
