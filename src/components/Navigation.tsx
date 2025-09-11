'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-sm border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/images/logo.png"
                alt="Luster & Co. Diamonds Logo"
                width={96}
                height={96}
                className="h-16 w-16 object-contain"
              />
            </motion.div>
            <motion.span 
              className="font-serif text-2xl font-semibold text-luster-blue"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Luster & Co.
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'About', 'Collections', 'Contact'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`#${item.toLowerCase()}`}
                  className="relative text-gray-800 hover:text-luster-blue transition-colors duration-200 font-medium group"
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-luster-blue"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
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
              className="text-gray-800 hover:text-luster-blue transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMenuOpen ? 'auto' : 0, 
            opacity: isMenuOpen ? 1 : 0 
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
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
                  className="block px-3 py-2 text-gray-800 hover:text-luster-blue transition-colors duration-200 font-medium rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
