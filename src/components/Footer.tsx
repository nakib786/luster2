'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Instagram, Mail, Phone, Heart, Sparkles, Facebook } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Footer = () => {
  const { effectiveTheme } = useTheme();
  
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
              Subscribe to receive updates on new collections and exclusive offers.
            </p>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Your email address"
                className={`backdrop-blur-sm text-white placeholder-gray-400 rounded-2xl h-12 theme-transition ${
                  effectiveTheme === 'dark'
                    ? 'bg-white/5 border-white/10 focus:border-primary focus:ring-primary/20'
                    : 'bg-white/10 border-white/20 focus:border-luster-blue focus:ring-luster-blue/20'
                }`}
              />
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25">
                Subscribe
              </Button>
            </div>
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
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={`text-center md:text-left theme-transition ${
              effectiveTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              © {new Date().getFullYear()} Luster & Co. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className={`flex items-center space-x-1 theme-transition ${
                effectiveTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-400" />
                <span>for luxury</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
