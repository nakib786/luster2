'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import CallbackForm from './CallbackForm';
import ProductModal from './ProductModal';
import FilterSidePanel from './FilterSidePanel';
import { Particles } from '@/components/ui/particles';
// Remove direct Wix API imports since we'll use the API route instead

interface Product {
  _id: string;
  name: string;
  description?: string;
  actualPriceRange?: {
    minValue?: {
      amount: string;
    };
  };
  compareAtPriceRange?: {
    minValue?: {
      amount: string;
    };
  };
  media?: {
    main?: {
      image?: string;
    };
    itemsInfo?: {
      items?: Array<{
        image?: string;
      }>;
    };
  };
  options?: Array<{
    _id: string;
    name: string;
    choicesSettings?: {
      choices?: Array<{
        choiceId: string;
        name: string;
      }>;
    };
  }>;
  categories?: Array<{ _id?: string; name?: string; }>;
  allCategoriesInfo?: {
    categories?: Array<{ _id?: string; index?: number; }>;
  };
  collections?: string[]; // Add collections field for current Wix API structure
  ribbons?: Array<{ text: string } | string>; // Add ribbons for sale indicators
  formattedPrice?: string; // Add formatted price from Wix
  inStock?: boolean;
  sku?: string;
  currency?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  visible: boolean;
}

const ProductStorefront = () => {
  const ref = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isCallbackFormOpen, setIsCallbackFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productImageIndices, setProductImageIndices] = useState<Record<string, number>>({});
  const [hoverTimers, setHoverTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    priceRange: { max: 10000000 }, // Increased to 10 million to accommodate all products
    selectedOptions: {} as Record<string, string[]>,
    search: '',
    sortBy: 'name-asc',
    selectedCategory: 'all'
  });

  // Only initialize motion hooks after component is mounted
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(hoverTimers).forEach(timer => {
        if (timer) clearInterval(timer);
      });
    };
  }, [hoverTimers]);

  // Fetch products from Wix using the API route
  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      console.log('Fetching products from API route...');
      // Add cache-busting parameter to ensure fresh data
      const url = forceRefresh ? `/api/products?t=${Date.now()}` : '/api/products';
      const response = await fetch(url);
      const productData = await response.json();
      
      if (productData.success && productData.data) {
        console.log('Products fetched successfully:', productData.data.totalProducts, 'products');
        
        // Use the products and collections directly from the API response
        const allProducts = productData.data.products || [];
        const collections = productData.data.collections || [];
        
        // Debug: Log the actual products data
        console.log('All products data:', allProducts);
        console.log('First product:', allProducts[0]);
        console.log('Collections data:', collections);
        
        // The data is already transformed by the API route
        setProducts(allProducts);
        const filteredCategories = collections.filter((col: { id: string }) => col.id !== 'all');
        setCategories(filteredCategories);
        
        // Check if the current selected category exists in the loaded categories
        const currentCategory = filters.selectedCategory;
        if (currentCategory !== 'all' && !filteredCategories.some((cat: { _id: string }) => cat._id === currentCategory)) {
          console.log(`Category "${currentCategory}" not found, resetting to 'all'`);
          setFilters(prev => ({
            ...prev,
            selectedCategory: 'all'
          }));
        }
        
        setError(null);
      } else {
        console.error('Failed to fetch products:', productData.error);
        setError(productData.error || 'Failed to load products. Please try again later.');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filters.selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Removed automatic refresh behaviors
  // Users can manually refresh using the refresh button in the filter panel


  // Get all product images
  const getAllProductImages = (product: Product): string[] => {
    const images: string[] = [];
    
    // Add main image
    if (product.media?.main?.image) {
      images.push(product.media.main.image);
    }
    
    // Add gallery images
    if (product.media?.itemsInfo?.items) {
      product.media.itemsInfo.items.forEach(item => {
        if (item.image && !images.includes(item.image)) {
          images.push(item.image);
        }
      });
    }
    
    return images;
  };

  // Handle automatic image cycling on hover
  const startImageCycling = (productId: string, images: string[]) => {
    if (images.length <= 1) return;
    
    // Clear any existing timer for this product
    if (hoverTimers[productId]) {
      clearInterval(hoverTimers[productId]);
    }
    
    // Start new timer
    const timer = setInterval(() => {
      setProductImageIndices(prev => {
        const currentIndex = prev[productId] || 0;
        const nextIndex = (currentIndex + 1) % images.length;
        return {
          ...prev,
          [productId]: nextIndex
        };
      });
    }, 1500); // Change image every 1.5 seconds
    
    setHoverTimers(prev => ({
      ...prev,
      [productId]: timer
    }));
  };

  const stopImageCycling = (productId: string) => {
    if (hoverTimers[productId]) {
      clearInterval(hoverTimers[productId]);
      setHoverTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[productId];
        return newTimers;
      });
    }
  };

  // Get consistent product ID
  const getProductId = (product: Product) => {
    return product._id || `product-${product.name?.substring(0, 10) || 'unknown'}`;
  };

  // Generate safe key for product elements
  const getSafeProductKey = (product: Product, suffix: string) => {
    return `${getProductId(product)}-${suffix}`;
  };

  // Extract text from rich text description or HTML string
  const getDescriptionText = (desc: unknown) => {
    if (typeof desc === 'string') {
      // If it's a string, check if it contains HTML tags
      if (desc.includes('<') && desc.includes('>')) {
        // Strip HTML tags and return clean text
        return desc.replace(/<[^>]*>/g, '').trim();
      }
      return desc;
    }
    const richText = desc as { nodes?: Array<{ nodes?: Array<{ textData?: { text?: string } }> }> };
    return richText?.nodes?.[0]?.nodes?.[0]?.textData?.text || '';
  };

  // Get product price
  const getProductPrice = (product: Product) => {
    const currentPrice = product.actualPriceRange?.minValue?.amount 
      ? `$${parseFloat(product.actualPriceRange.minValue.amount).toFixed(2)}`
      : 'Price unavailable';
    
    const compareAtPrice = product.compareAtPriceRange?.minValue?.amount 
      ? `$${parseFloat(product.compareAtPriceRange.minValue.amount).toFixed(2)}`
      : null;

    return { currentPrice, compareAtPrice };
  };

  // Check if product is on sale
  const isProductOnSale = (product: Product) => {
    // Check if product has ribbons indicating sale
    if (product.ribbons && product.ribbons.length > 0) {
      return true;
    }
    
    // Check if product has compare at price (automatic sale detection)
    if (product.compareAtPriceRange?.minValue?.amount) {
      const comparePrice = parseFloat(product.compareAtPriceRange.minValue.amount);
      const currentPrice = parseFloat(product.actualPriceRange?.minValue?.amount || '0');
      return comparePrice > currentPrice && currentPrice > 0;
    }
    
    return false;
  };

  // Get sale ribbon text
  const getSaleRibbonText = (product: Product) => {
    // If product has custom ribbons, use them
    if (product.ribbons && product.ribbons.length > 0) {
      return product.ribbons.map(ribbon => 
        typeof ribbon === 'string' ? ribbon : ribbon.text
      );
    }
    
    // If product is on sale based on price comparison, add "Sale" ribbon
    if (isProductOnSale(product) && product.compareAtPriceRange?.minValue?.amount) {
      const comparePrice = parseFloat(product.compareAtPriceRange.minValue.amount);
      const currentPrice = parseFloat(product.actualPriceRange?.minValue?.amount || '0');
      const discountPercent = Math.round(((comparePrice - currentPrice) / comparePrice) * 100);
      return [`${discountPercent}% OFF`];
    }
    
    return [];
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    console.log('Filtering products. Total products:', products.length);
    console.log('Current filters:', filters);
    
    const filtered = products.filter(product => {
      // Category filter
      if (filters.selectedCategory !== 'all') {
        // Check multiple possible category data structures
        const hasMatchingCategory = 
          // Check allCategoriesInfo.categories (legacy structure)
          product.allCategoriesInfo?.categories?.some(cat => cat._id === filters.selectedCategory) ||
          // Check categories array (legacy structure)
          product.categories?.some(cat => cat._id === filters.selectedCategory) ||
          // Check collections array (current Wix API structure)
          (product as Product & { collections?: string[] }).collections?.includes(filters.selectedCategory);
        
        console.log(`Product "${product.name}" category check:`, {
          selectedCategory: filters.selectedCategory,
          productCollections: (product as Product & { collections?: string[] }).collections,
          hasMatchingCategory
        });
        
        if (!hasMatchingCategory) return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const productName = String(product.name || '').toLowerCase();
        const description = getDescriptionText(product.description).toLowerCase();
        if (!productName.includes(searchTerm) && !description.includes(searchTerm)) {
          return false;
        }
      }

      // Price filter
      if (product.actualPriceRange?.minValue?.amount) {
        const price = parseFloat(product.actualPriceRange.minValue.amount);
        if (price > filters.priceRange.max) {
          console.log(`ProductStorefront: Product "${product.name}" filtered out by price: $${price} > $${filters.priceRange.max}`);
          return false;
        }
      }

      // Options filter
      for (const [optionName, selectedChoices] of Object.entries(filters.selectedOptions)) {
        if (selectedChoices.length > 0) {
          const productOption = product.options?.find(opt => opt.name === optionName);
          if (!productOption) return false;
          
          const hasMatchingChoice = productOption.choicesSettings?.choices?.some(choice => 
            selectedChoices.includes(choice.name)
          );
          if (!hasMatchingChoice) return false;
        }
      }

      return true;
    });

    console.log('Products after filtering:', filtered.length);
    console.log('Filtered products:', filtered.map(p => p.name));

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name-asc':
          return String(a.name || '').localeCompare(String(b.name || ''));
        case 'name-desc':
          return String(b.name || '').localeCompare(String(a.name || ''));
        case 'price-asc': {
          const priceA = a.actualPriceRange?.minValue?.amount ? parseFloat(a.actualPriceRange.minValue.amount) : 0;
          const priceB = b.actualPriceRange?.minValue?.amount ? parseFloat(b.actualPriceRange.minValue.amount) : 0;
          return priceA - priceB;
        }
        case 'price-desc': {
          const priceA = a.actualPriceRange?.minValue?.amount ? parseFloat(a.actualPriceRange.minValue.amount) : 0;
          const priceB = b.actualPriceRange?.minValue?.amount ? parseFloat(b.actualPriceRange.minValue.amount) : 0;
          return priceB - priceA;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters]);

  // Get available options for filtering
  const availableOptions = useMemo(() => {
    const optionsMap: Record<string, Set<string>> = {};
    
    products.forEach(product => {
      product.options?.forEach(option => {
        if (!optionsMap[option.name]) {
          optionsMap[option.name] = new Set();
        }
        option.choicesSettings?.choices?.forEach(choice => {
          optionsMap[option.name].add(choice.name);
        });
      });
    });

    return Object.entries(optionsMap).map(([name, choices]) => ({
      name,
      choices: Array.from(choices)
    }));
  }, [products]);

  // If not mounted yet, show loading
  if (!isMounted) {
    return (
      <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luster-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  // If there's an error and no products, show error message
  if (error && !products.length) {
    return (
      <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600 text-sm">Please check your Wix store configuration and try again.</p>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luster-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show products even if there's an error (partial failure)
  if (error && products.length === 0) {
    return (
      <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600 text-sm">Unable to load products from Wix store.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-32 bg-gradient-to-br from-gray-50 via-white to-slate-100 relative overflow-hidden">
      {/* Particle Background */}
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
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-32 left-10 w-72 h-72 bg-gradient-to-br from-luster-blue/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 0.4 }}
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
              Our Products
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

        {/* Filter Side Panel */}
        <div className="mb-8 flex justify-start">
          <FilterSidePanel
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            availableOptions={availableOptions}
            loading={loading}
            onRefresh={() => fetchData(true)}
            isOpen={isFilterPanelOpen}
            onOpenChange={setIsFilterPanelOpen}
          />
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product, index) => {
            const { currentPrice, compareAtPrice } = getProductPrice(product);
            const allImages = getAllProductImages(product);
            const productId = getProductId(product);
            const currentImageIndex = productImageIndices[productId] || 0;
            const currentImageUrl = allImages[currentImageIndex];
            const description = getDescriptionText(product.description);

            return (
              <motion.div
                key={getSafeProductKey(product, 'card')}
                initial={{ opacity: 0, y: 50, rotateX: 15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 15 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                onHoverStart={() => {
                  setHoveredCard(index);
                  startImageCycling(productId, allImages);
                }}
                onHoverEnd={() => {
                  setHoveredCard(null);
                  stopImageCycling(productId);
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="h-full cursor-pointer"
                onClick={() => {
                  setSelectedProduct(product);
                  setIsProductModalOpen(true);
                }}
              >
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white relative h-full flex flex-col rounded-2xl">
                  <div className="relative overflow-hidden rounded-t-2xl">
                    {currentImageUrl ? (
                      <motion.img
                        src={currentImageUrl}
                        alt={String(product.name || 'Product')}
                        className="w-full h-64 object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No image available</span>
                      </div>
                    )}
                    
                    
                    {/* Image Dots Indicator */}
                    {allImages.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {allImages.map((_, imageIndex) => (
                          <div
                            key={getSafeProductKey(product, `dot-${imageIndex}`)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              imageIndex === currentImageIndex
                                ? 'bg-white shadow-lg'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Ribbons */}
                    {getSaleRibbonText(product).length > 0 && (
                      <div className="absolute top-3 left-3 z-10">
                        {getSaleRibbonText(product).map((ribbonText: string, ribbonIndex: number) => (
                          <span
                            key={ribbonIndex}
                            className="inline-block bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg mb-2"
                          >
                            {ribbonText}
                          </span>
                        ))}
                      </div>
                    )}
                    
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
                          {String(product.name || 'Unnamed Product')}
                        </h3>
                        <div className="text-right">
                          <span className="text-luster-blue font-semibold text-sm bg-luster-blue/10 px-3 py-1 rounded-full">
                            {product.formattedPrice || currentPrice}
                          </span>
                          {compareAtPrice && (
                            <div className="text-xs text-gray-500 line-through mt-1">
                              {compareAtPrice}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {description || 'No description available'}
                      </p>
                      
                      {/* Product Options */}
                      {product.options && product.options.length > 0 && (
                        <div className="space-y-2">
                          {product.options.map(option => (
                            <div key={option._id} className="text-xs">
                              <span className="font-medium text-gray-700">{String(option.name)}: </span>
                              {option.choicesSettings?.choices?.map(choice => (
                                <span key={choice.choiceId} className="text-gray-600">
                                  {String(choice.name)}
                                  {choice !== option.choicesSettings?.choices?.[option.choicesSettings.choices.length - 1] && ', '}
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No products found matching your criteria.
            </p>
          </div>
        )}

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

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </section>
  );
};

export default ProductStorefront;
