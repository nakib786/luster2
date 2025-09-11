'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Instagram, Mail, Phone, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
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
            <Link href="/" className="flex items-center space-x-4 mb-8 group">
              <div className="relative">
                <div className="h-20 w-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg 
                    viewBox="600 500 800 800" 
                    className="h-18 w-18 fill-current text-white group-hover:text-luster-blue-light transition-colors duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M915.58,826.92c13.17-8.63,18.93-18.53,18.54-31.82c-0.59-19.83,1.64-39.03,12.59-56.25c7.37-11.58,16.8-20.82,30.7-23.66c22.06-4.5,42.68,16.36,40.39,40.2c-2.63,27.39-18.39,46.43-39.67,61.51c-27.2,19.27-55.34,37.24-82.26,56.88c-21.38,15.6-38.32,35.4-46.37,61.31c-13.13,42.26,10.55,86.38,55.06,102.24c36.13,12.88,72.07,10.95,105.38-7.67c24.75-13.83,47.46-31.3,71.17-46.99c16.33-10.81,32.93-21.53,53.46-21.42c7.66,0.04,15.31,2.47,24.1,4.01c-0.31-10.38-2.69-20.74-7.14-30.42c-13.63-29.7-38.4-44.49-69.37-50.51c-30.1-5.85-57.07,2.84-81.84,19.05c-16.77,10.98-32.13,24.11-48.97,34.95c-10.06,6.48-21.36,11.93-32.86,15.03c-11.05,2.98-22.33-0.22-29.86-10.23c-7.21-9.58-6.18-19.87-0.93-29.9c3.13-5.98,6.49-11.95,10.56-17.31c13.86-18.25,32.79-30.56,51.4-43.29c16.55-11.32,33.29-22.49,48.96-34.96c18.05-14.37,29.29-33.27,31.71-56.74c3.8-36.9-21.96-64.39-59.17-63.11c-35.04,1.2-61.44,25.53-65.46,60.4c-1.42,12.34,2.52,23.61,7.57,34.51C918.11,803.14,922.64,813.42,915.58,826.92"/>
                    <path d="M966.34,684.75c-9.82-11.24-19.53-22.36-29.35-33.6c1.4-1.98,2.8-3.97,4.21-5.96c1.23-1.74,2.42-3.5,3.72-5.18c0.33-0.43,1.02-0.83,1.54-0.83c13.25-0.05,26.49-0.04,39.74-0.01c0.44,0,1.06,0.18,1.3,0.5c2.75,3.77,5.44,7.58,8.2,11.47C985.93,662.33,976.19,673.47,966.34,684.75"/>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-luster-blue to-luster-blue-light rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
              </div>
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Luster & Co.
              </span>
            </Link>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
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
                href="https://www.tiktok.com/@lusterandcompany"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center hover:shadow-lg hover:shadow-gray-800/25 transition-all duration-300"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
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
            <h3 className="font-serif text-xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#home" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group">
                  <Sparkles className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group">
                  <Sparkles className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#collections" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group">
                  <Sparkles className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Collections
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group">
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
            <h3 className="font-serif text-xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Contact Info</h3>
            <div className="space-y-6">
              <motion.a
                href="tel:+17784448609"
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group w-full min-w-[320px]"
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
                className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group w-full min-w-[320px]"
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
            <h3 className="font-serif text-xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Stay Connected</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Subscribe to receive updates on new collections and exclusive offers.
            </p>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:border-luster-blue focus:ring-luster-blue/20 rounded-2xl h-12"
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
            <p className="text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} Luster & Co. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1 text-gray-400">
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
