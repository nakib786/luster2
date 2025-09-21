'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CallbackForm from '@/components/CallbackForm';
import ProductModal from '@/components/ProductModal';
import FilterSidePanel from '@/components/FilterSidePanel';
import { Particles } from '@/components/ui/particles';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useTheme } from '@/contexts/ThemeContext';
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

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isCallbackFormOpen, setIsCallbackFormOpen] = useState(false);
  const { effectiveTheme } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productImageIndices, setProductImageIndices] = useState<Record<string, number>>({});
  const [hoverTimers, setHoverTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Get category from URL parameters
  const categoryFromUrl = searchParams.get('category') || 'all';
  
  // Filter state
  const [filters, setFilters] = useState({
    priceRange: { max: 10000000 }, // Increased to 10 million to accommodate all products
    selectedOptions: {} as Record<string, string[]>,
    search: '',
    sortBy: 'name-asc',
    selectedCategory: categoryFromUrl
  });

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update filter when URL parameter changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'all';
    setFilters(prev => ({
      ...prev,
      selectedCategory: categoryFromUrl
    }));
  }, [searchParams]);

  // Update URL when selectedCategory changes (but not during initial load)
  useEffect(() => {
    // Skip URL update during initial load or when category comes from URL
    if (!isMounted) return;
    
    const params = new URLSearchParams(searchParams.toString());
    if (filters.selectedCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', filters.selectedCategory);
    }
    
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
  }, [filters.selectedCategory, isMounted, searchParams]);


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

  // Get the display name for the selected category
  const getCategoryDisplayName = () => {
    if (filters.selectedCategory === 'all') {
      return 'All Products';
    }
    
    // Find the category name from the categories array
    const selectedCategory = categories.find(cat => cat._id === filters.selectedCategory);
    return selectedCategory ? selectedCategory.name : 'All Products';
  };

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
    console.log('ProductsPage: Filtering products. Total products:', products.length);
    console.log('ProductsPage: Current filters:', filters);
    
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
        
        // Debug logging for category filtering (can be removed in production)
        console.log(`ProductsPage: Product "${product.name}" category check:`, {
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
          console.log(`ProductsPage: Product "${product.name}" filtered out by price: $${price} > $${filters.priceRange.max}`);
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

    console.log('ProductsPage: Products after filtering:', filtered.length);
    console.log('ProductsPage: Filtered products:', filtered.map(p => p.name));

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
      <div className={`min-h-screen theme-transition ${effectiveTheme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' : 'bg-gradient-to-br from-gray-50 via-white to-slate-100'}`}>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luster-blue mx-auto"></div>
            <p className="mt-4 ${effectiveTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If there's an error and no products, show error message
  if (error && !products.length) {
    return (
      <div className={`min-h-screen theme-transition ${effectiveTheme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' : 'bg-gradient-to-br from-gray-50 via-white to-slate-100'}`}>
        <Navigation />
        <div className="py-32 pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="${effectiveTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm">Please check your Wix store configuration and try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    console.log('Products page: Loading state, products count:', products.length);
    return (
      <div className={`min-h-screen theme-transition ${effectiveTheme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' : 'bg-gradient-to-br from-gray-50 via-white to-slate-100'}`}>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luster-blue mx-auto"></div>
            <p className="mt-4 ${effectiveTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen theme-transition ${effectiveTheme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' : 'bg-gradient-to-br from-gray-50 via-white to-slate-100'}`}>
        <Navigation />
        <div className="py-32 pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold text-red-800 mb-4">Wix API Configuration Required</h2>
                <p className="text-red-700 mb-4">{error}</p>
                <div className="text-left bg-white rounded p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">To fix this issue:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root</li>
                    <li>Add your Wix API credentials:
                      <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
{`WIX_CLIENT_ID=8a36ba43-6e83-4992-bc2c-8ebd8726f85b
WIX_SITE_ID=e3587e8a-ac64-44d8-952f-14001d3dd2f6
WIX_API_KEY=your_actual_api_key_here`}
                      </pre>
                    </li>
                    <li>Get your API key from <a href="https://dev.wix.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">dev.wix.com</a></li>
                    <li>Restart your development server</li>
                  </ol>
                </div>
                <p className="text-sm ${effectiveTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}">
                  For detailed setup instructions, see <code className="bg-gray-100 px-1 rounded">WIX_SETUP.md</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Products page: Rendering with', products.length, 'products, loading:', loading, 'error:', error);

  return (
    <div className={`min-h-screen theme-transition ${
      effectiveTheme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' 
        : 'bg-gradient-to-br from-gray-50 via-white to-slate-100'
    }`}>
      <Navigation />
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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-32 left-10 w-72 h-72 bg-gradient-to-br from-luster-blue/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute bottom-32 right-10 w-64 h-64 bg-gradient-to-br from-pink-500/10 to-luster-blue-light/10 rounded-full blur-2xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-32">
        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-luster-blue hover:text-luster-blue-dark transition-colors duration-300 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-luster-blue mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            key={filters.selectedCategory} // Re-animate when category changes
          >
            <span className="text-luster-blue">
              {getCategoryDisplayName()}
            </span>
          </motion.h1>
          <motion.p 
            className={`text-xl ${effectiveTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            key={`desc-${filters.selectedCategory}`} // Re-animate when category changes
          >
            {filters.selectedCategory === 'all' 
              ? "Discover our complete collection of exquisite jewelry pieces, each one a testament to our commitment to excellence and beauty."
              : `Explore our curated selection of ${getCategoryDisplayName().toLowerCase()}, showcasing the finest craftsmanship and timeless elegance.`
            }
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
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
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
                <Card className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 relative h-full flex flex-col rounded-2xl theme-transition ${
                  effectiveTheme === 'dark' 
                    ? 'bg-card border border-border/50' 
                    : 'bg-white'
                }`}>
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
                      <p className="${effectiveTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed">
                        {description || 'No description available'}
                      </p>
                      
                      {/* Product Options */}
                      {product.options && product.options.length > 0 && (
                        <div className="space-y-2">
                          {product.options.map(option => (
                            <div key={option._id} className="text-xs">
                              <span className="font-medium text-gray-700">{String(option.name)}: </span>
                              {option.choicesSettings?.choices?.map(choice => (
                                <span key={choice.choiceId} className={`theme-transition ${effectiveTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
            <p className={`theme-transition ${effectiveTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              No products found matching your criteria.
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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
      <Footer />
    </div>
  );
};

// Wrapper component with Suspense for useSearchParams
const ProductsPageWithSuspense = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-light">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsPage />
    </Suspense>
  );
};

export default ProductsPageWithSuspense;
