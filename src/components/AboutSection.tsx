'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Gem, Sparkles, Shield } from 'lucide-react';
import { Particles } from '@/components/ui/particles';
import { useTheme } from '@/contexts/ThemeContext';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { effectiveTheme } = useTheme();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);


  return (
    <section id="about" className={`py-32 relative overflow-hidden theme-transition ${
      effectiveTheme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' 
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
    }`}>
      {/* Particle Background */}
      <Particles
        className="absolute inset-0"
        quantity={30}
        staticity={50}
        ease={50}
        size={0.6}
        color={effectiveTheme === 'dark' ? '#60a5fa' : '#ffffff'}
        vx={0}
        vy={0}
      />
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ y }}
          className={`absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl ${
            effectiveTheme === 'dark' 
              ? 'bg-blue-500/20' 
              : 'bg-blue-100/30'
          }`}
        />
        <motion.div
          style={{ y: useTransform(y, [0, -100], [0, 50]) }}
          className={`absolute bottom-20 left-20 w-48 h-48 rounded-full blur-2xl ${
            effectiveTheme === 'dark' 
              ? 'bg-purple-500/15' 
              : 'bg-purple-100/20'
          }`}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.h2 
            className={`font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 theme-transition ${
              effectiveTheme === 'dark' ? 'text-primary' : 'text-luster-blue'
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className={effectiveTheme === 'dark' ? 'text-primary' : 'text-luster-blue'}>
              About Luster & Co.
            </span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 mb-16"
          >
            <p className={`text-xl md:text-2xl leading-relaxed font-light theme-transition ${
              effectiveTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              At Luster & Co., we are dedicated to creating exceptional jewelry that embodies 
              the perfect harmony of <span className={`font-semibold ${effectiveTheme === 'dark' ? 'text-primary' : 'text-luster-blue'}`}>fine craftsmanship</span>, 
              <span className={`font-semibold ${effectiveTheme === 'dark' ? 'text-primary' : 'text-luster-blue'}`}> timeless elegance</span>, and 
              <span className={`font-semibold ${effectiveTheme === 'dark' ? 'text-primary' : 'text-luster-blue'}`}> unwavering trust</span>.
            </p>
            <p className={`text-lg leading-relaxed max-w-4xl mx-auto theme-transition ${
              effectiveTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Each piece in our collection is meticulously crafted by master artisans who share 
              our passion for excellence and attention to detail, creating jewelry that tells your unique story.
            </p>
          </motion.div>

          {/* Three Pillars */}
          <div className="grid md:grid-cols-3 gap-12 mt-16">
            {[
              {
                icon: Gem,
                title: "Craftsmanship",
                description: "Master artisans with decades of experience create each piece with meticulous attention to detail and traditional techniques.",
                delay: 0.6
              },
              {
                icon: Sparkles,
                title: "Elegance", 
                description: "Timeless designs that capture the essence of luxury and sophistication, creating pieces that transcend trends.",
                delay: 0.8
              },
              {
                icon: Shield,
                title: "Trust",
                description: "Built on a foundation of integrity and transparency, we ensure every piece meets our exacting standards of quality and authenticity.",
                delay: 1.0
              }
            ].map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : { opacity: 0, y: 50, rotateY: -15 }}
                transition={{ 
                  duration: 0.8, 
                  delay: pillar.delay,
                  type: "spring",
                  stiffness: 100
                }}
                className="text-center group"
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className={`relative w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border theme-transition ${
                    effectiveTheme === 'dark'
                      ? 'bg-gradient-to-br from-primary/20 via-primary/30 to-primary/20 border-primary/20'
                      : 'bg-gradient-to-br from-luster-blue/20 via-luster-blue-light/30 to-luster-blue/20 border-luster-blue/20'
                  }`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    boxShadow: effectiveTheme === 'dark' 
                      ? "0 25px 50px rgba(99, 102, 241, 0.25)" 
                      : "0 25px 50px rgba(79, 172, 254, 0.25)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <pillar.icon className={`h-10 w-10 ${effectiveTheme === 'dark' ? 'text-primary' : 'text-luster-blue'}`} />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"
                    animate={{ 
                      opacity: [0.6, 0.9, 0.6],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <motion.h3 
                  className={`font-serif text-2xl font-bold mb-4 theme-transition ${
                    effectiveTheme === 'dark' ? 'text-primary' : 'text-luster-blue'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: pillar.delay + 0.2 }}
                >
                  {pillar.title}
                </motion.h3>
                <motion.p 
                  className={`leading-relaxed theme-transition ${
                    effectiveTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: pillar.delay + 0.4 }}
                >
                  {pillar.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
