'use client';

import { motion, useInView, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CallbackForm from './CallbackForm';
import { Particles } from '@/components/ui/particles';

interface WixCategory {
  _id: string;
  name: string;
  slug: string;
  visible: boolean;
  description?: string;
  image?: string;
  productCount?: number;
}

interface Collection {
  title: string;
  description: string;
  price: string;
  image: string;
  href: string;
  gradient: string;
}

// Separate component for scroll-based animations
const ScrollAnimatedSection = ({ children }: { children: (props: { ref: React.RefObject<HTMLDivElement | null>, isInView: boolean, y: MotionValue<number>, y2: MotionValue<number> }) => React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(y, [0, -50], [0, 25]);

  return (
    <div ref={ref}>
      {children({ ref, isInView, y, y2 })}
    </div>
  );
};

const CollectionsSection = () => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isCallbackFormOpen, setIsCallbackFormOpen] = useState(false);
  const [categories, setCategories] = useState<WixCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Fetch categories from Wix API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Fetching categories from API route...');
        const response = await fetch('/api/products');
        const productData = await response.json();
        
        if (productData.success && productData.data) {
          console.log('Categories fetched successfully');
          
          // Extract collections from the API response
          const collections = productData.data.collections || [];
          
          // Transform collections to categories (exclude 'all' collection)
          const transformedCategories = collections
            .filter((col: Record<string, unknown>) => col.id !== 'all')
            .map((col: Record<string, unknown>) => {
              try {
                return {
                  _id: col.id,
                  name: col.name,
                  slug: col.slug,
                  visible: true,
                  description: col.description,
                  image: col.image || '', // Use the image field directly
                  productCount: (col.products as unknown[])?.length || 0
                };
              } catch (transformError) {
                console.error('Error transforming collection:', col, transformError);
                return null;
              }
            })
            .filter(Boolean);
          
          console.log('Transformed categories for homepage:', transformedCategories);
          setCategories(transformedCategories);
          setError(null);
        } else {
          console.error('Failed to fetch categories:', productData.error);
          const errorMessage = productData.error || 'Failed to load categories. Please try again later.';
          
          // Check if it's a configuration error
          if (errorMessage.includes('credentials not configured') || errorMessage.includes('Wix Site ID is required')) {
            setError('Wix API credentials not configured. Please set up your Wix API credentials in .env.local file.');
          } else {
            setError(errorMessage);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Transform Wix categories to collections format
  const transformCategoriesToCollections = (categories: WixCategory[]): Collection[] => {
    const gradientOptions = [
      "from-pink-400/20 to-red-400/20",
      "from-blue-400/20 to-purple-400/20", 
      "from-green-400/20 to-teal-400/20",
      "from-yellow-400/20 to-orange-400/20",
      "from-purple-400/20 to-pink-400/20",
      "from-teal-400/20 to-blue-400/20",
      "from-orange-400/20 to-red-400/20",
      "from-indigo-400/20 to-purple-400/20"
    ];

    return categories.map((category, index) => ({
      title: category.name,
      description: category.description || `Explore our beautiful ${category.name.toLowerCase()} collection`,
      price: category.productCount ? `${category.productCount} items` : "View Collection",
      image: category.image || '/placeholder-image.jpg', // Provide fallback for undefined images
      href: `/products?category=${category._id}`,
      gradient: gradientOptions[index % gradientOptions.length]
    }));
  };

  // Only use Wix categories - no fallbacks
  const collections = transformCategoriesToCollections(categories);
  console.log('Collections to render on homepage:', collections);

  // Show loading state
  if (loading) {
    return (
      <section id="collections" className="py-32 bg-gradient-to-br from-gray-50 via-white to-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luster-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading collections...</p>
          </div>
        </div>
      </section>
    );
  }

  // Render without scroll animations initially, then with animations after hydration
  if (!isHydrated) {
    return (
      <section id="collections" className="py-32 bg-gradient-to-br from-gray-50 via-white to-slate-100 relative overflow-hidden">
        <Particles
          className="absolute inset-0"
          quantity={100}
          staticity={50}
          ease={50}
          size={0.6}
          color="#ffffff"
          vx={0}
          vy={0}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-luster-blue mb-8">
              <span className="text-luster-blue">Featured Collections</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated selection of exquisite jewelry pieces, 
              each one a testament to our commitment to excellence and beauty.
            </p>
          </div>
          
          {error && (
            <div className="text-center mb-8">
              <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg inline-block">
                {error}
              </p>
              {error.includes('credentials not configured') && (
                <div className="mt-4 text-xs text-gray-600 bg-gray-50 px-4 py-2 rounded-lg inline-block">
                  <p>To fix this:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Create a .env.local file in your project root</li>
                    <li>Add your Wix API credentials (see env-template.txt for format)</li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {collections.length === 0 && !loading && !error && (
            <div className="text-center mb-8">
              <p className="text-gray-600 text-sm bg-gray-50 px-4 py-2 rounded-lg inline-block">
                No collections found. Please check your Wix store configuration.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <div 
                key={collection.title} 
                className="h-full cursor-pointer"
                onClick={() => {
                  router.push(collection.href);
                }}
              >
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white relative h-full flex flex-col rounded-2xl">
                  <div className="relative overflow-hidden rounded-t-2xl">
                    {collection.image ? (
                      <img
                        src={collection.image}
                        alt={collection.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          console.log('Image failed to load:', collection.image);
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-full h-64 bg-gradient-to-br from-luster-blue/20 to-purple-500/20 flex items-center justify-center"
                      style={{ display: collection.image ? 'none' : 'flex' }}
                    >
                      <span className="text-luster-blue font-semibold text-lg">{collection.title}</span>
                    </div>
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
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => setIsCallbackFormOpen(true)}
              className="bg-luster-blue hover:bg-luster-blue-dark text-white px-12 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border-2 border-luster-blue hover:border-luster-blue-dark"
            >
              <span className="flex items-center">
                Request a Consultation
                <Phone className="ml-3 h-5 w-5" />
              </span>
            </button>
          </div>
        </div>

        <CallbackForm 
          isOpen={isCallbackFormOpen} 
          onClose={() => setIsCallbackFormOpen(false)} 
        />
      </section>
    );
  }

  return (
    <section id="collections" className="py-32 bg-gradient-to-br from-gray-50 via-white to-slate-100 relative overflow-hidden">
      <Particles
        className="absolute inset-0"
        quantity={100}
        staticity={50}
        ease={50}
        size={0.6}
        color="#ffffff"
        vx={0}
        vy={0}
      />
      
      <ScrollAnimatedSection>
        {({ isInView, y, y2 }) => (
          <>
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                style={{ y }}
                className="absolute top-32 left-10 w-72 h-72 bg-gradient-to-br from-luster-blue/10 to-purple-500/10 rounded-full blur-3xl"
              />
              <motion.div
                style={{ y: y2 }}
                className="absolute bottom-32 right-10 w-64 h-64 bg-gradient-to-br from-pink-500/10 to-luster-blue-light/10 rounded-full blur-2xl"
              />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <motion.div
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
                  <span className="text-luster-blue">Featured Collections</span>
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

              {/* Error message if there's an issue loading Wix data */}
              {error && (
                <div className="text-center mb-8">
                  <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg inline-block">
                    {error}
                  </p>
                  {error.includes('credentials not configured') && (
                    <div className="mt-4 text-xs text-gray-600 bg-gray-50 px-4 py-2 rounded-lg inline-block">
                      <p>To fix this:</p>
                      <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Create a .env.local file in your project root</li>
                        <li>Add your Wix API credentials (see env-template.txt for format)</li>
                        <li>Restart your development server</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              {collections.length === 0 && !loading && !error && (
                <div className="text-center mb-8">
                  <p className="text-gray-600 text-sm bg-gray-50 px-4 py-2 rounded-lg inline-block">
                    No collections found. Please check your Wix store configuration.
                  </p>
                </div>
              )}

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
                    className="h-full cursor-pointer"
                    onClick={() => {
                      router.push(collection.href);
                    }}
                  >
                    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white relative h-full flex flex-col rounded-2xl">
                      <div className="relative overflow-hidden rounded-t-2xl">
                        {collection.image ? (
                          <motion.img
                            src={collection.image}
                            alt={collection.title}
                            className="w-full h-64 object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6 }}
                            onError={(e) => {
                              console.log('Image failed to load:', collection.image);
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-64 bg-gradient-to-br from-luster-blue/20 to-purple-500/20 flex items-center justify-center"
                          style={{ display: collection.image ? 'none' : 'flex' }}
                        >
                          <span className="text-luster-blue font-semibold text-lg">{collection.title}</span>
                        </div>
                        
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
          </>
        )}
      </ScrollAnimatedSection>

      {/* Callback Form Modal */}
      <CallbackForm 
        isOpen={isCallbackFormOpen} 
        onClose={() => setIsCallbackFormOpen(false)} 
      />
    </section>
  );
};

export default CollectionsSection;
