'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Instagram, Mail, Phone, Heart, Sparkles, Facebook, MapPin } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

const Footer = () => {
  const { effectiveTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'duplicate'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Creative success messages for Luster & Co.
  const successMessages = [
    "🎉 Welcome to the Luster family! You're now part of our exclusive circle of luxury connoisseurs.",
    "✨ Congratulations! You've just unlocked VIP access to our most coveted collections and secret sales.",
    "💎 You're in! Get ready for exclusive previews, member-only discounts, and first access to limited editions.",
    "🌟 Welcome to luxury redefined! You'll be the first to discover our newest treasures and special offers.",
    "👑 You've joined the elite! Expect exclusive invitations, early access, and insider updates from Luster & Co.",
    "🦋 Welcome to our exclusive community! You're now part of something truly special and luxurious."
  ];

  // Creative duplicate messages
  const duplicateMessages = [
    "💎 You're already part of our exclusive circle! We're keeping you updated on all our luxury offerings.",
    "✨ You're already in our VIP list! We'll continue sending you our most exclusive updates and offers.",
    "👑 You're already a member of our luxury family! Stay tuned for more exclusive content and special deals.",
    "🌟 You're already part of our exclusive community! We're working on amazing new collections just for you.",
    "🦋 You're already in our inner circle! We'll keep you updated on our latest luxury discoveries."
  ];

  // Creative error messages
  const errorMessages = [
    "⚠️ Oops! Something went wrong on our end. Please try again or contact us at info@lusterandcompany.com",
    "🔧 We're experiencing a small hiccup. Please try again in a moment or reach out to us directly.",
    "💫 Our system is having a brief moment. Please try again or contact our team for assistance.",
    "⚡ Technical difficulties on our end. Please try again or email us at info@lusterandcompany.com"
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubmitStatus('error');
      setStatusMessage('✨ Oops! We need your email to unlock the door to our exclusive luxury world. Please enter a valid email address.');
      setTimeout(() => {
        setSubmitStatus('idle');
        setStatusMessage('');
      }, 5000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Google Apps Script Web App URL - using GET method to avoid CORS issues
      const webAppUrl = 'https://script.google.com/macros/s/AKfycbxgW3-LEBnW26mzlHoDbrkdPOGoNLWa7Rknx0nAscJ09ZuXnhnuOJkydRfVm954kBOvGw/exec';
      
      // Use GET request with email as parameter (works better with Google Apps Script)
      const response = await fetch(`${webAppUrl}?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        mode: 'cors'
      });

      const result = await response.json();
      console.log('Backend response:', result); // Debug log

      if (result.success) {
        setSubmitStatus('success');
        // Use creative frontend message instead of backend message
        const randomSuccessMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
        setStatusMessage(randomSuccessMessage);
        setEmail('');
        
        // Clear success message after 6 seconds (longer for creative messages)
        setTimeout(() => {
          setSubmitStatus('idle');
          setStatusMessage('');
        }, 6000);
      } else {
        // Handle specific error messages from backend
        const message = result.message || '';
        const isDuplicate = message.includes('already part of our exclusive') || 
                           message.includes('already subscribed') ||
                           message.includes('already in our') ||
                           message.includes('already a member') ||
                           message.includes('already part of');
        
        if (isDuplicate) {
          setSubmitStatus('duplicate');
          const randomDuplicateMessage = duplicateMessages[Math.floor(Math.random() * duplicateMessages.length)];
          setStatusMessage(randomDuplicateMessage);
        } else {
          setSubmitStatus('error');
          const randomErrorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
          setStatusMessage(randomErrorMessage);
        }
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
          setStatusMessage('');
        }, 5000);
      }
      
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      
      // Fallback: Try with no-cors mode
      try {
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbxgW3-LEBnW26mzlHoDbrkdPOGoNLWa7Rknx0nAscJ09ZuXnhnuOJkydRfVm954kBOvGw/exec';
        
        await fetch(`${webAppUrl}?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          mode: 'no-cors'
        });

        // Since no-cors mode doesn't allow reading the response,
        // we'll assume success if no error was thrown
        setSubmitStatus('success');
        const randomSuccessMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
        setStatusMessage(randomSuccessMessage);
        setEmail('');
        
        setTimeout(() => {
          setSubmitStatus('idle');
          setStatusMessage('');
        }, 6000);
        
      } catch (fallbackError) {
        console.error('Fallback subscription error:', fallbackError);
        setSubmitStatus('error');
        const randomErrorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        setStatusMessage(randomErrorMessage);
        
        setTimeout(() => {
          setSubmitStatus('idle');
          setStatusMessage('');
        }, 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <footer id="contact" className={`text-white relative overflow-hidden theme-transition ${
      effectiveTheme === 'dark' 
        ? 'bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900' 
        : 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Link href="/" className="flex items-center space-x-3 group mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/images/footer-logo.svg"
                  alt="Luster & Co. Diamonds Logo"
                  width={320}
                  height={240}
                  className="h-18 w-auto object-contain brightness-110 group-hover:brightness-125 transition-all duration-300"
                />
              </motion.div>
            </Link>
            <p className={`mb-8 leading-relaxed text-lg theme-transition ${
              effectiveTheme === 'dark' ? 'text-gray-200' : 'text-gray-300'
            }`}>
              Shaping brilliance, defining elegance. We create exceptional jewelry 
              that embodies the perfect harmony of craftsmanship and luxury.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://www.instagram.com/lusterandcompany"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
              >
                <Instagram className="h-6 w-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://www.facebook.com/profile.php?id=61579904796363"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                <Facebook className="h-6 w-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://www.tiktok.com/@lusterandcompany"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center hover:shadow-lg hover:shadow-gray-500/25 transition-all duration-300"
              >
                <Image
                  src="/images/tiktok-1.svg"
                  alt="TikTok"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className={`font-serif text-xl font-bold mb-8 bg-clip-text text-transparent ${
              effectiveTheme === 'dark' 
                ? 'bg-gradient-to-r from-gray-100 to-gray-400' 
                : 'bg-gradient-to-r from-white to-gray-300'
            }`}>Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#home" className={`hover:text-white transition-all duration-300 flex items-center group theme-transition ${
                  effectiveTheme === 'dark' ? 'text-gray-200' : 'text-gray-300'
                }`}>
                  <Sparkles className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className={`hover:text-white transition-all duration-300 flex items-center group theme-transition ${
                  effectiveTheme === 'dark' ? 'text-gray-200' : 'text-gray-300'
                }`}>
                  <Sparkles className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#collections" className={`hover:text-white transition-all duration-300 flex items-center group theme-transition ${
                  effectiveTheme === 'dark' ? 'text-gray-200' : 'text-gray-300'
                }`}>
                  <Sparkles className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Collections
                </Link>
              </li>
              <li>
                <Link href="#contact" className={`hover:text-white transition-all duration-300 flex items-center group theme-transition ${
                  effectiveTheme === 'dark' ? 'text-gray-200' : 'text-gray-300'
                }`}>
                  <Sparkles className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h3 className={`font-serif text-xl font-bold mb-8 bg-clip-text text-transparent ${
              effectiveTheme === 'dark' 
                ? 'bg-gradient-to-r from-gray-100 to-gray-400' 
                : 'bg-gradient-to-r from-white to-gray-300'
            }`}>Contact Info</h3>
            <div className="space-y-6">
              <motion.a
                href="tel:+17784448609"
                whileHover={{ scale: 1.02, x: 5 }}
                className={`flex items-center space-x-4 p-4 backdrop-blur-sm rounded-2xl transition-all duration-300 group w-full min-w-[320px] theme-transition ${
                  effectiveTheme === 'dark' 
                    ? 'bg-white/3 border border-white/5 hover:bg-white/8' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-luster-blue to-luster-blue-light rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Phone</p>
                  <p className="text-white font-medium">+1 (778) 444-8609</p>
                </div>
              </motion.a>
              
              <motion.a
                href="mailto:info@lusterandcompany.com"
                whileHover={{ scale: 1.02, x: 5 }}
                className={`flex items-center space-x-4 p-4 backdrop-blur-sm rounded-2xl transition-all duration-300 group w-full min-w-[320px] theme-transition ${
                  effectiveTheme === 'dark' 
                    ? 'bg-white/3 border border-white/5 hover:bg-white/8' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-luster-blue to-luster-blue-light rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">Email</p>
                  <p className="text-white font-medium">info@lusterandcompany.com</p>
                </div>
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.02, x: 5 }}
                href="https://maps.google.com/?q=609+W+Hastings+St,+Vancouver,+BC+V6B+4W4"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-4 p-4 backdrop-blur-sm rounded-2xl transition-all duration-300 group w-full min-w-[320px] theme-transition cursor-pointer ${
                  effectiveTheme === 'dark' 
                    ? 'bg-white/3 border border-white/5 hover:bg-white/8 hover:border-luster-blue/30' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-luster-blue/30'
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-luster-blue to-luster-blue-light rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">Address</p>
                  <p className="text-white font-medium group-hover:text-luster-blue transition-colors duration-300">
                    609 W Hastings St, Vancouver, BC V6B 4W4
                  </p>
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h3 className={`font-serif text-xl font-bold mb-8 bg-clip-text text-transparent ${
              effectiveTheme === 'dark' 
                ? 'bg-gradient-to-r from-gray-100 to-gray-400' 
                : 'bg-gradient-to-r from-white to-gray-300'
            }`}>Stay Connected</h3>
            <p className={`mb-6 leading-relaxed theme-transition ${
              effectiveTheme === 'dark' ? 'text-gray-200' : 'text-gray-300'
            }`}>
              Join our exclusive community to receive early access to new luxury collections, special member-only offers, and insider updates from Luster & Co.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email to join our exclusive circle ✨"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`backdrop-blur-sm text-white placeholder-gray-400 rounded-2xl h-12 theme-transition ${
                  submitStatus === 'duplicate'
                    ? 'border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20'
                    : effectiveTheme === 'dark'
                    ? 'bg-white/5 border-white/10 focus:border-primary focus:ring-primary/20'
                    : 'bg-white/10 border-white/20 focus:border-luster-blue focus:ring-luster-blue/20'
                }`}
                required
              />
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="text-lg"
                    >
                      ✨
                    </motion.span>
                    Joining our exclusive circle...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>💎</span>
                    Join Our Exclusive Circle
                  </span>
                )}
              </Button>
              
              {/* Status Messages */}
              {submitStatus && statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20,
                    duration: 0.5 
                  }}
                  className={`text-sm text-center leading-relaxed p-4 rounded-2xl backdrop-blur-sm border ${
                    submitStatus === 'success' 
                      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-lg shadow-emerald-400/10' 
                      : submitStatus === 'duplicate'
                      ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20 shadow-lg shadow-yellow-400/10'
                      : 'text-red-400 bg-red-400/10 border-red-400/20 shadow-lg shadow-red-400/10'
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                    className="inline-block mr-2"
                  >
                    {submitStatus === 'success' && '✨'}
                    {submitStatus === 'duplicate' && '💎'}
                    {submitStatus === 'error' && '⚠️'}
                  </motion.div>
                  <span className="font-medium">{statusMessage}</span>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-16 pt-8"
        >
          <div className="flex flex-col space-y-4">
            <p className={`text-center theme-transition ${
              effectiveTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              © {new Date().getFullYear()} Luster & Co. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <div className={`flex items-center space-x-1 theme-transition ${
                effectiveTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-400" />
                <span>for luxury</span>
              </div>
              <div className={`text-center sm:text-left theme-transition ${
                effectiveTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <span>Website crafted by </span>
                <a 
                  href="https://www.aurorabusiness.ca/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-luster-blue hover:text-luster-blue-light transition-colors duration-300 font-medium"
                >
                  Aurora N&N Business Solutions Inc.
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
