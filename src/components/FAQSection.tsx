'use client';

import { HelpCircle } from 'lucide-react';
import { FaqAccordion } from '@/components/ui/faq-chat-accordion';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon?: string;
  iconPosition?: "left" | "right";
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'Are your diamonds certified?',
    answer: 'Absolutely. Every diamond is certified by the International Gemological Institute (IGI) or the Gemological Institute of America (GIA). This ensures authenticity and quality, giving you full confidence in your purchase.',
    icon: '💎',
    iconPosition: 'left'
  },
  {
    id: 2,
    question: 'Do you offer custom jewelry design services?',
    answer: 'Yes! Our expert craftsmen can create custom pieces tailored to your specifications. We offer personalized consultations to bring your unique vision to life with the highest quality materials and craftsmanship, all backed by our lifetime warranty.',
    icon: '🎨',
    iconPosition: 'right'
  },
  {
    id: 3,
    question: 'Are your diamonds conflict-free?',
    answer: 'Yes, all our diamonds are conflict-free and ethically sourced. We are committed to responsible sourcing practices and only work with suppliers who adhere to the Kimberley Process and other international standards for ethical diamond trading.',
    icon: '🌍',
    iconPosition: 'left'
  },
  {
    id: 4,
    question: 'What should I look for when buying a diamond?',
    answer: 'When buying a diamond, focus on the 4Cs: Cut (most important for brilliance), Color (D-Z scale), Clarity (FL-I3 scale), and Carat weight. Also consider certification from reputable labs like GIA or IGI, and ensure the diamond comes with proper documentation and warranty.',
    icon: '🔍',
    iconPosition: 'right'
  },
  {
    id: 5,
    question: 'Do you offer a warranty on your jewelry?',
    answer: 'Yes, we provide a free lifetime warranty against manufacturing faults on every diamond. If a fault is discovered, we will repair or replace the item free of cost. This warranty does not cover damages caused by wear and tear or inappropriate use by the customer.',
    icon: '🛡️',
    iconPosition: 'left'
  },
  {
    id: 6,
    question: 'Are lab-grown diamonds real diamonds?',
    answer: 'Yes, lab-grown diamonds are real diamonds with the same physical, chemical, and optical properties as natural diamonds. They are created in controlled laboratory environments using advanced technology and offer excellent value while being more environmentally friendly.',
    icon: '🧪',
    iconPosition: 'right'
  },
  {
    id: 7,
    question: 'Do lab-grown diamonds have the same value as natural diamonds?',
    answer: 'Lab-grown diamonds typically cost 30-50% less than natural diamonds of similar quality, making them an excellent value proposition. While they may not appreciate in value like natural diamonds, they offer the same beauty and durability at a more accessible price point.',
    icon: '💰',
    iconPosition: 'left'
  },
  {
    id: 8,
    question: 'How often should I get my jewelry cleaned?',
    answer: 'We recommend professional cleaning every 6-12 months to maintain your jewelry\'s brilliance and check for any potential issues. You can also clean your jewelry at home using mild soap and warm water, but avoid harsh chemicals and ultrasonic cleaners unless recommended by a professional.',
    icon: '✨',
    iconPosition: 'right'
  },
  {
    id: 9,
    question: 'Do you have a return policy?',
    answer: 'We offer a flexible 15-day exchange policy. You can exchange your jewelry for another item of equal or greater value within 15 days from the date of delivery. The jewelry must be in its original, unworn condition, with all tags and certifications intact.',
    icon: '🔄',
    iconPosition: 'left'
  },
  {
    id: 10,
    question: 'How do I book a virtual appointment?',
    answer: 'You can book a virtual appointment through our website or by calling us directly. Our virtual consultations allow you to view our jewelry collection, discuss custom designs, and get expert advice from the comfort of your home. We use high-quality video technology to provide a personalized experience.',
    icon: '💻',
    iconPosition: 'right'
  },
  {
    id: 11,
    question: 'What are your shipping options?',
    answer: 'We offer multiple shipping options including standard shipping (3-5 business days), express shipping (1-2 business days), and overnight delivery. All items are shipped with full insurance and tracking. International shipping is also available with customs documentation included.',
    icon: '🚚',
    iconPosition: 'left'
  },
  {
    id: 12,
    question: 'Do you offer ring resizing services?',
    answer: 'Yes, we offer a complimentary ring resizing service within 30 days of your purchase. If your ring doesn\'t fit just right, we will resize it for you once, free of charge. This service is available for most ring styles, with a quick turnaround time, performed by expert in-house jewelers.',
    icon: '🔧',
    iconPosition: 'right'
  },
  {
    id: 13,
    question: 'What is the difference between natural and lab-grown diamonds?',
    answer: 'Natural diamonds are formed over billions of years deep within the Earth, while lab-grown diamonds are created in a controlled environment. Both are visually identical and have the same chemical composition, but lab-grown diamonds are typically more affordable.',
    icon: '⚖️',
    iconPosition: 'left'
  }
];

export default function FAQSection() {

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our jewelry, services, and policies. 
            Can&apos;t find what you&apos;re looking for? Contact our expert team for personalized assistance.
          </p>
        </div>

        {/* Chat-style FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
            <FaqAccordion 
              data={faqData}
              timestamp=""
              className="bg-transparent p-0"
              questionClassName="bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-800/30 text-slate-900 dark:text-white"
              answerClassName="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
            />
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Our jewelry experts are here to help you find the perfect piece or answer any questions you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const footer = document.querySelector('footer');
                  if (footer) {
                    footer.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
              >
                Contact Us
              </button>
              <button 
                onClick={() => {
                  // Open Tawk.to chat
                  if (typeof window !== 'undefined' && (window as unknown as { Tawk_API?: { maximize: () => void } }).Tawk_API) {
                    (window as unknown as { Tawk_API: { maximize: () => void } }).Tawk_API.maximize();
                  } else if (typeof window !== 'undefined' && (window as unknown as { $tawk?: { maximize: () => void } }).$tawk) {
                    (window as unknown as { $tawk: { maximize: () => void } }).$tawk.maximize();
                  } else {
                    // Fallback: try to find and click the Tawk.to widget
                    const tawkWidget = document.querySelector('[data-tawk-widget]') || 
                                     document.querySelector('.tawk-widget') ||
                                     document.querySelector('#tawk-widget');
                    if (tawkWidget) {
                      (tawkWidget as HTMLElement).click();
                    }
                  }
                }}
                className="px-8 py-3 border-2 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-center"
              >
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
