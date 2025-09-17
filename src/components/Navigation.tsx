'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('home');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        // Check if hero section is still visible (at least 50% visible)
        setIsHeroVisible(rect.bottom > window.innerHeight * 0.5);
      }
    };

    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl"
    >
      {/* Tube Light Container */}
      <div className="relative">
        {/* Outer Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-white/30 to-amber-400/20 rounded-full blur-xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Inner Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-300/10 via-white/20 to-amber-300/10 rounded-full blur-lg"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1.01, 1.03, 1.01],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />

        {/* Main Header Container - Glass Morphism */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl overflow-hidden">
          {/* Glass Top Border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          
          {/* Glass Bottom Border */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          
          {/* Inner Glass Reflection */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full" />
          
          {/* Glass Side Borders */}
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          
          <div className="px-6 sm:px-8 lg:px-12">
            <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                   <Image
                     src="/images/EPS-11-optimized.svg"
                     alt="Luster & Co. Diamonds Logo"
                     width={200}
                     height={200}
                     className="h-14 w-14 sm:h-16 sm:w-16 lg:h-18 lg:w-18 object-contain"
                   />
                </motion.div>
                 <motion.span 
                   className={`font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold drop-shadow-lg transition-colors duration-300 ${
                     isHeroVisible ? 'text-white/95' : 'text-black/95'
                   }`}
                   whileHover={{ scale: 1.05 }}
                   transition={{ type: "spring", stiffness: 300 }}
                 >
                   Luster & Co.
                 </motion.span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                {['Home', 'About', 'Collections', 'Contact'].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link
                      href={`#${item.toLowerCase()}`}
                      className={`relative transition-all duration-300 font-medium group px-4 py-2 rounded-full hover:bg-white/10 hover:backdrop-blur-sm border border-transparent hover:border-white/20 ${
                        isHeroVisible 
                          ? 'text-white/90 hover:text-white' 
                          : 'text-black/90 hover:text-black'
                      }`}
                    >
                      {item}
                      <motion.div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-lg"
                        initial={{ width: 0 }}
                        whileHover={{ width: '80%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <motion.button
                  onClick={toggleMenu}
                  className="text-white/90 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-white/10 hover:backdrop-blur-sm border border-transparent hover:border-white/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{ rotate: isMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Glass Morphism Dropdown */}
        <motion.div
          initial={{ height: 0, opacity: 0, y: -20 }}
          animate={{ 
            height: isMenuOpen ? 'auto' : 0, 
            opacity: isMenuOpen ? 1 : 0,
            y: isMenuOpen ? 0 : -20
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="md:hidden overflow-hidden mt-2"
        >
          <div className="relative">
            {/* Mobile Menu Glass Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-2xl blur-xl"
              animate={{
                opacity: isMenuOpen ? [0.3, 0.5, 0.3] : 0,
                scale: isMenuOpen ? [1, 1.01, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: isMenuOpen ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
            
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 space-y-2">
              {/* Glass Top Border */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-2xl" />
              
              {/* Glass Bottom Border */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-b-2xl" />
              
              {/* Inner Glass Reflection */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl" />
              
              {['Home', 'About', 'Collections', 'Contact'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ 
                    x: isMenuOpen ? 0 : -50, 
                    opacity: isMenuOpen ? 1 : 0 
                  }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="block px-4 py-3 text-white/90 hover:text-white transition-all duration-300 font-medium rounded-xl hover:bg-white/10 hover:backdrop-blur-sm border border-transparent hover:border-white/20 hover:shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
