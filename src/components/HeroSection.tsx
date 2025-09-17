'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Sparkles, Diamond, Star } from 'lucide-react';
import Image from 'next/image';
import CallbackForm from './CallbackForm';
import { Particles } from '@/components/ui/particles';

const HeroSection = () => {
  const [currentText, setCurrentText] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [isCallbackFormOpen, setIsCallbackFormOpen] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  const taglines = [
    "Where every diamond tells a story of elegance and perfection",
    "Crafting timeless elegance for modern luxury",
    "Where luxury meets exceptional craftsmanship",
    "Exquisite pieces for life's precious moments"
  ];

  const heroImages = [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1523170335258-f5c6c6f7ff67?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % taglines.length);
    }, 4000);
    
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => {
        const next = (prev + 1) % heroImages.length;
        return next;
      });
    }, 3000);
    
    return () => {
      clearInterval(textInterval);
      clearInterval(imageInterval);
    };
  }, [taglines.length, heroImages.length]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 lg:pt-28">
      {/* Particle Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Particle effect */}
        <Particles
          className="absolute inset-0"
          quantity={150}
          staticity={50}
          ease={50}
          size={0.6}
          color="#ffffff"
          vx={0}
          vy={0}
        />
        
        {/* Sophisticated overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-rose-500/5" />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-7rem)] py-8 sm:py-12 pb-20 sm:pb-12"
        >
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6">
            {/* Brand Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-medium shadow-lg"
            >
              <Diamond className="w-4 h-4 mr-2 text-amber-400" />
              Premium Diamonds • Luxury Crafted
            </motion.div>

            {/* Main Headline */}
            <motion.div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="flex justify-center lg:justify-start"
              >
                <Image
                  src="/images/EPS-02.svg"
                  alt="Luster & Co. Diamonds Logo"
                  width={2000}
                  height={2000}
                  className="h-40 md:h-48 lg:h-56 xl:h-64 w-auto object-contain"
                  priority
                />
              </motion.div>

              {/* Animated Taglines */}
              <div className="relative h-20 overflow-hidden mt-4">
                {taglines.map((tagline, index) => (
                  <motion.p
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{
                      y: currentText === index ? 0 : currentText > index ? -50 : 50,
                      opacity: currentText === index ? 1 : 0,
                    }}
                    transition={{ 
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 font-light text-xl md:text-2xl text-white max-w-2xl leading-relaxed drop-shadow-lg"
                  >
                    {tagline}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex justify-center lg:justify-start pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  onClick={() => setIsCallbackFormOpen(true)}
                  className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-white/25 transition-all duration-300 group"
                >
                  <span className="flex items-center">
                    <Phone className="mr-3 h-5 w-5" />
                    Request a Callback
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Phone className="ml-3 h-5 w-5" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="hidden md:flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 pt-8 text-white/90"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm">5.0 Customer Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm">Lifetime Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Diamond className="w-4 h-4 text-amber-400" />
                <span className="text-sm">Certified Authentic</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Featured Product */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="relative lg:translate-x-50"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none">
              {/* Main Product Image */}
              <motion.div
                className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {heroImages.map((image, index) => (
                  <motion.div
                    key={`${image}-${index}`}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ 
                      opacity: currentImage === index ? 1 : 0,
                      scale: currentImage === index ? 1 : 1.1
                    }}
                    transition={{ 
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={image}
                      alt={`Luxury jewelry ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </motion.div>
                ))}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-rose-400/20 rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
                animate={{ 
                  scale: [1.1, 1, 1.1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Modern Scroll Indicator */}
      <motion.div 
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center space-y-2 sm:space-y-3"
        >
          <span className="text-white/80 text-xs font-medium tracking-widest uppercase drop-shadow-md">Discover More</span>
          <motion.div
            className="w-5 h-8 sm:w-6 sm:h-10 border border-white/50 rounded-full flex justify-center relative overflow-hidden shadow-lg"
            whileHover={{ scale: 1.1, borderColor: "rgba(255,255,255,0.6)" }}
          >
            <motion.div
              animate={{ y: [2, 12, 2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 sm:h-3 bg-white rounded-full mt-1 sm:mt-2 shadow-sm"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Callback Form Modal */}
      <CallbackForm 
        isOpen={isCallbackFormOpen} 
        onClose={() => setIsCallbackFormOpen(false)} 
      />
    </section>
  );
};

export default HeroSection;
