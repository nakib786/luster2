'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Slide {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Luxury diamond ring collection',
    title: 'Elegant Diamond Collection',
    description: 'Discover our exquisite diamond pieces crafted with precision and passion'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Luxury gold necklace',
    title: 'Contemporary Gold Series',
    description: 'Modern designs that blend tradition with contemporary elegance'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    alt: 'Premium jewelry showcase',
    title: 'Premium Craftsmanship',
    description: 'Handcrafted pieces that tell stories of luxury and sophistication'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1523170335258-f5c6c6f7ff67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Luxury watch collection',
    title: 'Timeless Timepieces',
    description: 'Masterfully crafted watches that stand the test of time'
  }
];

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl group shadow-2xl">
      {/* Main Image Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide].src}
              alt={slides[currentSlide].alt}
              fill
              className="object-cover"
              priority={currentSlide === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Modern Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-800/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-rose-500/10" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="max-w-md"
              >
                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-3 text-white">
                  {slides[currentSlide].title}
                </h3>
                <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      <motion.button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 border border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>

      {/* Modern Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Modern Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-rose-400"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 5, ease: "linear" }}
        key={currentSlide}
      />

      {/* Modern Play/Pause Button */}
      <motion.button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-6 right-6 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 border border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isAutoPlaying ? (
          <motion.div
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-4 h-4 flex items-center justify-center"
          >
            <div className="w-1 h-3 bg-white rounded-full mx-auto" />
          </motion.div>
        ) : (
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-0 h-0 border-l-[5px] border-l-white border-y-[3px] border-y-transparent ml-0.5" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default ImageSlider;
