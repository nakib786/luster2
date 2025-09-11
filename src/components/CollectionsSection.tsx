'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import CallbackForm from './CallbackForm';

const CollectionsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isCallbackFormOpen, setIsCallbackFormOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const collections = [
    {
      title: "Engagement Rings",
      description: "Symbols of eternal love and commitment",
      price: "From $2,500",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=600&fit=crop&crop=center",
      href: "#engagement-rings",
      gradient: "from-pink-400/20 to-red-400/20"
    },
    {
      title: "Necklaces",
      description: "Elegant pieces that grace every occasion",
      price: "From $800",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=600&fit=crop&crop=center",
      href: "#necklaces",
      gradient: "from-blue-400/20 to-purple-400/20"
    },
    {
      title: "Bracelets",
      description: "Delicate adornments for the wrist",
      price: "From $600",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=600&fit=crop&crop=center",
      href: "#bracelets",
      gradient: "from-green-400/20 to-teal-400/20"
    },
    {
      title: "Custom Pieces",
      description: "Bespoke creations tailored to your vision",
      price: "From $1,200",
      image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=600&fit=crop&crop=center",
      href: "#custom",
      gradient: "from-yellow-400/20 to-orange-400/20"
    }
  ];

  return (
    <section id="collections" className="py-32 bg-gradient-to-br from-gray-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ y }}
          className="absolute top-32 left-10 w-72 h-72 bg-gradient-to-br from-luster-blue/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(y, [0, -50], [0, 25]) }}
          className="absolute bottom-32 right-10 w-64 h-64 bg-gradient-to-br from-pink-500/10 to-luster-blue-light/10 rounded-full blur-2xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h2 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-luster-blue mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-luster-blue">
              Featured Collections
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover our carefully curated selection of exquisite jewelry pieces, 
            each one a testament to our commitment to excellence and beauty.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 50, rotateX: 15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 15 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ y: -8, scale: 1.02 }}
              className="h-full"
            >
              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white relative h-full flex flex-col rounded-2xl">
                <div className="relative overflow-hidden rounded-t-2xl">
                  <motion.img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-64 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Modern Gradient Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === index ? 1 : 0.3 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                </div>
                
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-xl font-bold text-luster-blue leading-tight">
                        {collection.title}
                      </h3>
                      <span className="text-luster-blue font-semibold text-sm bg-luster-blue/10 px-3 py-1 rounded-full">
                        {collection.price}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {collection.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCallbackFormOpen(true)}
            className="bg-luster-blue hover:bg-luster-blue-dark text-white px-12 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border-2 border-luster-blue hover:border-luster-blue-dark"
          >
            <span className="flex items-center">
              Request a Consultation
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Phone className="ml-3 h-5 w-5" />
              </motion.div>
            </span>
          </motion.button>
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

export default CollectionsSection;
