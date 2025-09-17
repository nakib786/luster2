'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ConstructionPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Check if popup was already shown in this session
    const hasShownPopup = sessionStorage.getItem('construction-popup-shown');
    
    if (!hasShownPopup) {
      // Show popup after a brief delay to ensure page is loaded
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem('construction-popup-shown', 'true');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Start countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsVisible(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Close popup"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Site Under Construction
          </h2>

          {/* Message */}
          <p className="text-gray-600 leading-relaxed mb-6">
            We&apos;re working hard to bring you the best experience. Please excuse any bugs or temporary issues as our team is actively improving the site.
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-amber-100 rounded-full p-3">
              <span className="text-2xl font-bold text-amber-600">
                {countdown}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              seconds remaining
            </span>
          </div>

          {/* Auto-close notice */}
          <p className="text-sm text-gray-500">
            This message will close automatically
          </p>
        </div>
      </div>
    </div>
  );
}
