'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Gem, Sparkles, Shield } from 'lucide-react';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);


  return (
    <section id="about" className="py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ y }}
          className="absolute top-20 right-20 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(y, [0, -100], [0, 50]) }}
          className="absolute bottom-20 left-20 w-48 h-48 bg-purple-100/20 rounded-full blur-2xl"
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
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-luster-blue mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-luster-blue">
              About Luster & Co.
            </span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 mb-16"
          >
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
              At Luster & Co., we are dedicated to creating exceptional jewelry that embodies 
              the perfect harmony of <span className="text-luster-blue font-semibold">fine craftsmanship</span>, 
              <span className="text-luster-blue font-semibold"> timeless elegance</span>, and 
              <span className="text-luster-blue font-semibold"> unwavering trust</span>.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
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
                  className="relative w-24 h-24 bg-gradient-to-br from-luster-blue/20 via-luster-blue-light/30 to-luster-blue/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-luster-blue/20"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    boxShadow: "0 25px 50px rgba(79, 172, 254, 0.25)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <pillar.icon className="h-10 w-10 text-luster-blue" />
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
                  className="font-serif text-2xl font-bold text-luster-blue mb-4"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: pillar.delay + 0.2 }}
                >
                  {pillar.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 leading-relaxed"
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
