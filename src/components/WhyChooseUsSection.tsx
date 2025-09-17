'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Award, Users, Clock, Sparkles, Shield, Heart, ArrowRight } from 'lucide-react';
import { Particles } from '@/components/ui/particles';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { SpotlightCardWithImage } from '@/components/ui/spotlight-card-with-image';
import CallbackForm from './CallbackForm';

const WhyChooseUsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isCallbackFormOpen, setIsCallbackFormOpen] = useState(false);

  const features = [
    {
      icon: Award,
      title: "Award-Winning Craftsmanship",
      description: "Our master artisans have been recognized internationally for their exceptional skill and attention to detail in jewelry creation.",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      glowColor: "amber" as const,
      backgroundImage: "/images/EPS-01.svg"
    },
    {
      icon: Users,
      title: "Personalized Service",
      description: "We work closely with each client to understand their vision and create pieces that perfectly reflect their style and story.",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      glowColor: "blue" as const,
      backgroundImage: "/images/EPS-02.svg"
    },
    {
      icon: Clock,
      title: "Timeless Quality",
      description: "Every piece is built to last generations, using only the finest materials and time-tested techniques.",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      glowColor: "emerald" as const,
      backgroundImage: "/images/EPS-03.svg"
    },
    {
      icon: Sparkles,
      title: "Exclusive Designs",
      description: "Each piece is uniquely crafted with innovative techniques and contemporary aesthetics that set trends in luxury jewelry.",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      glowColor: "purple" as const,
      backgroundImage: "/images/EPS-04.svg"
    },
    {
      icon: Shield,
      title: "Lifetime Guarantee",
      description: "We stand behind our craftsmanship with comprehensive warranties and lifetime maintenance services for all our pieces.",
      iconColor: "text-slate-600",
      iconBg: "bg-slate-50",
      glowColor: "slate" as const,
      backgroundImage: "/images/EPS-05.svg"
    },
    {
      icon: Heart,
      title: "Ethical Sourcing",
      description: "We are committed to responsible sourcing, ensuring every gem and metal comes from ethical and sustainable suppliers.",
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50",
      glowColor: "rose" as const,
      backgroundImage: "/images/EPS-06.svg"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.03),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.03),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">Why Choose Us</span>
          </motion.div>
          
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Why Choose Luster & Co.?
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We combine traditional craftsmanship with modern innovation to create 
            jewelry that exceeds expectations and stands the test of time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <SpotlightCardWithImage
                glowColor={feature.glowColor}
                backgroundImage={feature.backgroundImage}
                customSize={true}
                className="h-full w-full"
                icon={
                  <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center`}>
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                }
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="relative bg-slate-900 border border-slate-800 text-white overflow-hidden rounded-lg">
            {/* Background Paths */}
            <div className="absolute inset-0 opacity-20">
              <BackgroundPaths title="Start Your Journey" asBackground={true} />
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-12 md:p-16">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8"
              >
                <Heart className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Start Your Journey</span>
              </motion.div>
              
              <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Ready to Begin Your Journey?
              </h3>
              <p className="text-lg mb-10 text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Let us help you create the perfect piece that tells your unique story. 
                Book a consultation with our experts today and discover the art of luxury jewelry.
              </p>
              
              <div className="flex justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={() => setIsCallbackFormOpen(true)}
                  className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 text-base font-semibold"
                >
                  Book a Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Callback Form Modal */}
      <CallbackForm 
        isOpen={isCallbackFormOpen} 
        onClose={() => setIsCallbackFormOpen(false)} 
      />
    </section>
  );
};

export default WhyChooseUsSection;
