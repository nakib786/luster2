'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, ExternalLink, MessageCircle, Heart, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { TestimonialStack, Testimonial } from './glass-testimonial-swiper';

const ReviewsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { effectiveTheme } = useTheme();

  const testimonials: Testimonial[] = [
    {
      id: 1,
      initials: "SJ",
      name: "Sarah Johnson",
      role: "Verified Customer",
      quote: "Absolutely stunning jewelry! The craftsmanship is exceptional and the customer service was outstanding. The engagement ring exceeded all my expectations.",
      tags: [
        { text: "Engagement Ring", type: "featured" },
        { text: "5 Stars", type: "default" }
      ],
      stats: [
        { icon: Star, text: "5.0 Rating" },
        { icon: Heart, text: "Verified Purchase" }
      ],
      avatarGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 2,
      initials: "PK",
      name: "Priya Kumar",
      role: "Verified Customer",
      quote: "Beautiful pieces and excellent quality. The team was very helpful in helping me choose the perfect engagement ring. The attention to detail is remarkable.",
      tags: [
        { text: "Custom Design", type: "featured" },
        { text: "5 Stars", type: "default" }
      ],
      stats: [
        { icon: Award, text: "Premium Quality" },
        { icon: Sparkles, text: "Custom Made" }
      ],
      avatarGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: 3,
      initials: "AS",
      name: "Arjun Sharma",
      role: "Verified Customer",
      quote: "Outstanding experience from start to finish. The jewelry exceeded my expectations and the attention to detail is remarkable. Highly recommend Luster & Co!",
      tags: [
        { text: "Necklace", type: "featured" },
        { text: "5 Stars", type: "default" }
      ],
      stats: [
        { icon: Star, text: "5.0 Rating" },
        { icon: Heart, text: "Verified Purchase" }
      ],
      avatarGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      id: 4,
      initials: "DP",
      name: "Deepika Patel",
      role: "Verified Customer",
      quote: "The quality and craftsmanship are simply outstanding. My husband loves his anniversary bracelet. The customer service was exceptional throughout the entire process.",
      tags: [
        { text: "Anniversary Gift", type: "featured" },
        { text: "5 Stars", type: "default" }
      ],
      stats: [
        { icon: Award, text: "Premium Quality" },
        { icon: Heart, text: "Verified Purchase" }
      ],
      avatarGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    },
    {
      id: 5,
      initials: "RS",
      name: "Rajesh Singh",
      role: "Verified Customer",
      quote: "Incredible attention to detail and beautiful designs. The team made the entire process seamless and enjoyable. I couldn't be happier with my purchase.",
      tags: [
        { text: "Earrings", type: "featured" },
        { text: "5 Stars", type: "default" }
      ],
      stats: [
        { icon: Star, text: "5.0 Rating" },
        { icon: Sparkles, text: "Custom Made" }
      ],
      avatarGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    },
    {
      id: 6,
      initials: "KG",
      name: "Kavya Gupta",
      role: "Verified Customer",
      quote: "The wedding jewelry collection is absolutely breathtaking! Every piece tells a story of elegance and tradition. The team understood exactly what I was looking for.",
      tags: [
        { text: "Wedding Collection", type: "featured" },
        { text: "5 Stars", type: "default" }
      ],
      stats: [
        { icon: Star, text: "5.0 Rating" },
        { icon: Heart, text: "Verified Purchase" }
      ],
      avatarGradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
    },
    {
      id: 7,
      initials: "VM",
      name: "Vikram Mehta",
      role: "Verified Customer",
      quote: "Exceptional service and stunning jewelry! The custom design process was smooth and the final piece exceeded all expectations. Highly professional team.",
      tags: [
        { text: "Custom Design", type: "featured" },
        { text: "5 Stars", type: "default" }
      ],
      stats: [
        { icon: Award, text: "Premium Quality" },
        { icon: Sparkles, text: "Custom Made" }
      ],
      avatarGradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    }
  ];


  return (
    <section 
      ref={ref}
      id="reviews" 
      className={`py-32 relative overflow-hidden theme-transition ${
        effectiveTheme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' 
          : 'bg-gradient-to-br from-gray-50 via-white to-slate-100'
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-luster-blue mb-8">
            <span className="text-luster-blue">What Our Customers Say</span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed theme-transition ${
            effectiveTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Don&apos;t just take our word for it. Read what our satisfied customers have to say about their experience with Luster & Co.
          </p>
        </motion.div>

        {/* Glass Testimonial Swiper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <TestimonialStack 
            testimonials={testimonials} 
            visibleBehind={2}
          />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className={`inline-flex flex-col sm:flex-row items-center gap-6 p-8 rounded-3xl backdrop-blur-sm border theme-transition ${
            effectiveTheme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-white/80 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-2xl theme-transition ${
                effectiveTheme === 'dark' 
                  ? 'bg-luster-blue/20 border border-luster-blue/30' 
                  : 'bg-luster-blue/10 border border-luster-blue/20'
              }`}>
                <MessageCircle className="h-6 w-6 text-luster-blue" />
              </div>
              <div className="text-left">
                <span className={`text-xl font-bold theme-transition ${
                  effectiveTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Share Your Experience
                </span>
                <p className={`text-sm theme-transition ${
                  effectiveTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Help others discover the quality of our jewelry
                </p>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button
                asChild
                className={`relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl ${
                  effectiveTheme === 'dark'
                    ? 'bg-gradient-to-r from-luster-blue via-blue-600 to-luster-blue-light hover:from-luster-blue-light hover:via-blue-500 hover:to-luster-blue text-white shadow-luster-blue/30 hover:shadow-luster-blue/50'
                    : 'bg-gradient-to-r from-luster-blue via-blue-600 to-luster-blue-light hover:from-luster-blue-light hover:via-blue-500 hover:to-luster-blue text-white shadow-luster-blue/40 hover:shadow-luster-blue/60'
                }`}
              >
                <a
                  href="https://g.page/r/CbWMwp6cK5qHEBM/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 relative z-10"
                >
                  <span>Write a Review</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
              
              {/* Animated background effect */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                effectiveTheme === 'dark'
                  ? 'bg-gradient-to-r from-luster-blue/20 via-blue-600/20 to-luster-blue-light/20'
                  : 'bg-gradient-to-r from-luster-blue/30 via-blue-600/30 to-luster-blue-light/30'
              }`}></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
