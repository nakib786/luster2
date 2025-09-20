'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Phone, Mail, User, MessageSquare, Clock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface CallbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  preferredTime: string;
  message: string;
}

const CallbackForm = ({ isOpen, onClose }: CallbackFormProps) => {
  const { effectiveTheme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    preferredTime: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create FormData for FormSubmit.co
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('phone', formData.phone);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('preferredTime', formData.preferredTime);
      formDataToSubmit.append('message', formData.message);
      formDataToSubmit.append('_subject', 'Callback Request - Luster & Co.');
      formDataToSubmit.append('_next', window.location.href);
      formDataToSubmit.append('_replyto', formData.email);

      // FormSubmit.co endpoint
      const response = await fetch('https://formsubmit.co/info@lusterandcompany.com', {
        method: 'POST',
        body: formDataToSubmit
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          preferredTime: '',
          message: ''
        });
        // Close form after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto theme-transition ${
              effectiveTheme === 'dark' 
                ? 'bg-gray-900 border border-gray-700' 
                : 'bg-white'
            }`}>
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b theme-transition ${
                effectiveTheme === 'dark' ? 'border-gray-700' : 'border-slate-200'
              }`}>
                <div>
                  <h2 className={`text-2xl font-serif font-bold theme-transition ${
                    effectiveTheme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    Request a Callback
                  </h2>
                  <p className={`mt-1 theme-transition ${
                    effectiveTheme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    We&apos;ll get back to you within 24 hours
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors theme-transition ${
                    effectiveTheme === 'dark' 
                      ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                      : 'hover:bg-slate-100 text-slate-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className={`text-sm font-medium flex items-center gap-2 theme-transition ${
                    effectiveTheme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    <User className="w-4 h-4" />
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className={`text-sm font-medium flex items-center gap-2 theme-transition ${
                    effectiveTheme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className={`text-sm font-medium flex items-center gap-2 theme-transition ${
                    effectiveTheme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full"
                  />
                </div>

                {/* Preferred Time Field */}
                <div className="space-y-2">
                  <label htmlFor="preferredTime" className={`text-sm font-medium flex items-center gap-2 theme-transition ${
                    effectiveTheme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    <Clock className="w-4 h-4" />
                    Preferred Callback Time
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent theme-transition ${
                      effectiveTheme === 'dark' 
                        ? 'bg-gray-800 border-gray-600 text-gray-100' 
                        : 'bg-white border-slate-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label htmlFor="message" className={`text-sm font-medium flex items-center gap-2 theme-transition ${
                    effectiveTheme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    <MessageSquare className="w-4 h-4" />
                    Additional Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your jewelry needs or any specific questions..."
                    rows={4}
                    className="w-full resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 text-lg font-semibold theme-transition ${
                    effectiveTheme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    'Request Callback'
                  )}
                </Button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border rounded-lg theme-transition ${
                      effectiveTheme === 'dark'
                        ? 'bg-green-900/30 border-green-700'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <p className={`text-sm font-medium theme-transition ${
                      effectiveTheme === 'dark' ? 'text-green-300' : 'text-green-800'
                    }`}>
                      ✅ Thank you! We&apos;ll call you back within 24 hours.
                    </p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border rounded-lg theme-transition ${
                      effectiveTheme === 'dark'
                        ? 'bg-red-900/30 border-red-700'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <p className={`text-sm font-medium theme-transition ${
                      effectiveTheme === 'dark' ? 'text-red-300' : 'text-red-800'
                    }`}>
                      ❌ Something went wrong. Please try again or call us directly.
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CallbackForm;
