'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const { effectiveTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    // Always show icon based on effective theme (what user actually sees)
    return effectiveTheme === 'dark' ? Moon : Sun;
  };

  const getLabel = () => {
    // Always show label based on effective theme
    return effectiveTheme === 'dark' ? 'Dark mode' : 'Light mode';
  };

  const Icon = getIcon();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`relative h-10 w-10 rounded-full transition-all duration-300 hover:scale-110 ${
        effectiveTheme === 'dark'
          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
          : 'bg-black/5 hover:bg-black/10 text-black border border-black/10'
      }`}
      aria-label={getLabel()}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={effectiveTheme}
          initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Icon className="h-5 w-5" />
        </motion.div>
      </AnimatePresence>
      
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-full blur-xl opacity-0 ${
          effectiveTheme === 'dark'
            ? 'bg-blue-400/30'
            : 'bg-amber-400/30'
        }`}
        animate={{
          opacity: [0, 0.5, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </Button>
  );
};

export default ThemeToggle;
