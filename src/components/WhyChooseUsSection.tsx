'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Users, Clock, Sparkles, Shield, Heart } from 'lucide-react';

const WhyChooseUsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Award,
      title: "Award-Winning Craftsmanship",
      description: "Our master artisans have been recognized internationally for their exceptional skill and attention to detail in jewelry creation.",
      gradient: "from-amber-400 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50"
    },
    {
      icon: Users,
      title: "Personalized Service",
      description: "We work closely with each client to understand their vision and create pieces that perfectly reflect their style and story.",
      gradient: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: Clock,
      title: "Timeless Quality",
      description: "Every piece is built to last generations, using only the finest materials and time-tested techniques.",
      gradient: "from-emerald-400 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    {
      icon: Sparkles,
      title: "Exclusive Designs",
      description: "Each piece is uniquely crafted with innovative techniques and contemporary aesthetics that set trends in luxury jewelry.",
      gradient: "from-purple-400 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: Shield,
      title: "Lifetime Guarantee",
      description: "We stand behind our craftsmanship with comprehensive warranties and lifetime maintenance services for all our pieces.",
      gradient: "from-slate-400 to-gray-500",
      bgGradient: "from-slate-50 to-gray-50"
    },
    {
      icon: Heart,
      title: "Ethical Sourcing",
      description: "We are committed to responsible sourcing, ensuring every gem and metal comes from ethical and sustainable suppliers.",
      gradient: "from-rose-400 to-red-500",
      bgGradient: "from-rose-50 to-red-50"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 shadow-lg"
          >
            <Sparkles className="h-5 w-5 text-luster-blue" />
            <span className="text-sm font-medium text-luster-blue">Why Choose Us</span>
          </motion.div>
          
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Why Choose Luster & Co.?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We combine traditional craftsmanship with modern innovation to create 
            jewelry that exceeds expectations and stands the test of time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full">
                {/* Glassmorphism Card */}
                <div className="h-full bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/80">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-30 rounded-3xl`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white drop-shadow-sm" />
                    </motion.div>
                    
                    <h3 className="font-serif text-xl font-bold text-gray-800 mb-4 group-hover:text-luster-blue transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="relative">
            {/* Solid dark background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-3xl"></div>
            <div className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 backdrop-blur-sm border border-white/20 rounded-3xl p-12 md:p-16 text-white overflow-hidden shadow-2xl">
              {/* Subtle animated background elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/3 rounded-full blur-2xl animate-pulse delay-1000"></div>
              </div>
              
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8 shadow-lg"
                >
                  <Heart className="h-5 w-5 text-white" />
                  <span className="text-sm font-medium text-white">Start Your Journey</span>
                </motion.div>
                
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white drop-shadow-sm">
                  Ready to Begin Your Journey?
                </h3>
                <p className="text-xl mb-10 text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
                  Let us help you create the perfect piece that tells your unique story. 
                  Book a consultation with our experts today and discover the art of luxury jewelry.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-luster-blue px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:bg-gray-50 border-2 border-white/20"
                  >
                    Book a Consultation
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white/50 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-white/20 hover:border-white/70 shadow-lg"
                  >
                    View Gallery
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
