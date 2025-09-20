'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X, Phone } from 'lucide-react';
import { wixClient } from '@/lib/wix-client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface ProductVariant {
  _id: string;
  price?: {
    actualPrice?: {
      amount: string;
      formattedAmount?: string;
    };
  };
  inventoryStatus?: {
    inStock: boolean;
  };
  choices?: Array<{
    optionChoiceNames?: {
      optionName: string;
      choiceName: string;
    };
  }>;
}

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
  currency?: string;
  media?: {
    main?: {
      image?: string;
    };
    itemsInfo?: {
      items?: Array<{
        image?: string;
        mediaType?: string;
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
  variantsInfo?: {
    variants?: ProductVariant[];
  };
  inventory?: {
    availabilityStatus?: string;
  };
}

interface ProductPageProps {
  productId: string;
}

const ProductPage: React.FC<ProductPageProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        if (!wixClient) {
          setError('Wix client not initialized. Please check your configuration.');
          setLoading(false);
          return;
        }
        
        const response = await wixClient.productsV3.getProduct(productId, {
          fields: [
            'DESCRIPTION',
            'MEDIA_ITEMS_INFO',
            'VARIANT_OPTION_CHOICE_NAMES',
            'CURRENCY',
            'URL'
          ]
        });
        
        setProduct(response as unknown as Product);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Get product image URL
  const getProductImageUrl = useCallback((imageId: string) => {
    if (wixClient) {
      try {
        return wixClient.media.getImageUrl(imageId).url;
      } catch (error) {
        console.error('Error getting image URL:', error);
        return null;
      }
    }
    return null;
  }, []);

  // Get all product images
  const productImages = useMemo(() => {
    if (!product?.media) return [];
    
    const images = [];
    
    // Add main image
    if (product.media.main?.image) {
      images.push(getProductImageUrl(product.media.main.image));
    }
    
    // Add gallery images
    if (product.media.itemsInfo?.items) {
      product.media.itemsInfo.items
        .filter(item => item.mediaType === 'IMAGE' && item.image)
        .forEach(item => {
          if (item.image) {
            images.push(getProductImageUrl(item.image));
          }
        });
    }
    
    return images;
  }, [product, getProductImageUrl]);

  // Extract text from rich text description or HTML string
  const getDescriptionText = (desc: unknown): string => {
    if (typeof desc === 'string') {
      // If it's a string, check if it contains HTML tags
      if (desc.includes('<') && desc.includes('>')) {
        // Strip HTML tags and return clean text
        return desc.replace(/<[^>]*>/g, '').trim();
      }
      return desc;
    }
    
    const richText = desc as { nodes?: unknown[] };
    if (!richText?.nodes) return '';
    
    const extractText = (nodes: unknown[]): string => {
      return nodes.map(node => {
        const nodeObj = node as { nodeType?: string; textData?: { text?: string }; nodes?: unknown[] };
        if (nodeObj.nodeType === 'TEXT' && nodeObj.textData?.text) {
          return nodeObj.textData.text;
        }
        if (nodeObj.nodes) {
          return extractText(nodeObj.nodes);
        }
        return '';
      }).join('');
    };
    
    return extractText(richText.nodes);
  };

  // Get selected variant
  const selectedVariant = useMemo((): ProductVariant | null => {
    if (!product?.variantsInfo?.variants) return null;
    
    const variant = product.variantsInfo.variants.find((variant) => {
      if (!variant.choices) return false;
      return variant.choices.every((choice) => {
        const optionName = choice.optionChoiceNames?.optionName;
        const choiceName = choice.optionChoiceNames?.choiceName;
        if (!optionName || !choiceName) return false;
        return selectedOptions[optionName] === choiceName;
      });
    });

    return variant || null;
  }, [product, selectedOptions]);

  // Get current price
  const getCurrentPrice = () => {
    if (selectedVariant?.price?.actualPrice) {
      return selectedVariant.price.actualPrice.formattedAmount || 
             `$${parseFloat(selectedVariant.price.actualPrice.amount).toFixed(2)}`;
    }
    
    if (product?.actualPriceRange?.minValue?.amount) {
      return `$${parseFloat(product.actualPriceRange.minValue.amount).toFixed(2)}`;
    }
    
    return 'Price unavailable';
  };

  // Generate safe key for product elements
  const getSafeProductKey = (suffix: string) => {
    const productId = product?._id || `product-${Date.now()}`;
    return `${productId}-${suffix}`;
  };

  // Get compare at price
  const getCompareAtPrice = () => {
    if (product?.compareAtPriceRange?.minValue?.amount) {
      const comparePrice = parseFloat(product.compareAtPriceRange.minValue.amount);
      if (comparePrice > 0) {
        return `$${comparePrice.toFixed(2)}`;
      }
    }
    return null;
  };

  // Handle option selection
  const handleOptionSelect = (optionName: string, choiceName: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: choiceName
    }));
  };

  // Check if choice is available
  const isChoiceAvailable = (optionName: string, choiceName: string) => {
    if (!product?.variantsInfo?.variants) return true;
    
    // Check if this choice combination is valid
    const testOptions = { ...selectedOptions, [optionName]: choiceName };
    
    return product.variantsInfo.variants.some(variant => {
      if (!variant.choices) return false;
      return variant.choices.every(choice => {
        const optName = choice.optionChoiceNames?.optionName;
        const chName = choice.optionChoiceNames?.choiceName;
        if (!optName || !chName) return false;
        return testOptions[optName] === chName;
      });
    });
  };

  // Check if all required options are selected
  const allOptionsSelected = () => {
    if (!product?.options) return true;
    return product.options.every(option => selectedOptions[option.name]);
  };

  // Check if current selection is valid
  const isValidSelection = () => {
    return allOptionsSelected() && selectedVariant !== null;
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100">
        <Navigation />
        <div className="flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luster-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100">
        <Navigation />
        <div className="flex items-center justify-center pt-24">
          <div className="text-center">
            <p className="text-red-600 text-xl mb-4">{error || 'Product not found'}</p>
            <Button 
              onClick={() => window.history.back()}
              className="bg-luster-blue hover:bg-luster-blue-dark text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="bg-white hover:bg-gray-50 border-gray-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              {productImages.length > 0 ? (
                <img
                  src={productImages[selectedImageIndex]}
                  alt={String(product.name || 'Product')}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={getSafeProductKey(`thumbnail-${index}`)}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-luster-blue'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${String(product.name || 'Product')} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Product Title */}
            <div>
              <h1 className="font-serif text-4xl font-bold text-luster-blue mb-4">
                {String(product.name || 'Unnamed Product')}
              </h1>
              
              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-luster-blue">
                  {getCurrentPrice()}
                </span>
                {getCompareAtPrice() && (
                  <span className="text-xl text-gray-500 line-through">
                    {getCompareAtPrice()}
                  </span>
                )}
              </div>
            </div>

            {/* Product Options */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-6">
                {product.options.map(option => (
                  <div key={option._id} className="space-y-3">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {String(option.name)}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {option.choicesSettings?.choices?.map(choice => {
                        const isSelected = selectedOptions[option.name] === choice.name;
                        const isAvailable = isChoiceAvailable(option.name, choice.name);
                        
                        return (
                          <button
                            key={choice.choiceId}
                            onClick={() => {
                              if (isAvailable) {
                                handleOptionSelect(option.name, choice.name);
                              }
                            }}
                            disabled={!isAvailable}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-luster-blue bg-luster-blue text-white'
                                : isAvailable
                                ? 'border-gray-200 hover:border-luster-blue hover:text-luster-blue'
                                : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {String(choice.name)}
                              {!isAvailable && <X className="h-4 w-4" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Validation Messages */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-2">
                {!allOptionsSelected() && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      Please select all required options
                    </p>
                  </div>
                )}
                
                {allOptionsSelected() && !isValidSelection() && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">
                      This combination is not available
                    </p>
                  </div>
                )}
                
                {isValidSelection() && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Valid selection
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Contact Button */}
            <div className="pt-6">
              <Button
                onClick={() => window.location.href = '#contact'}
                className="w-full bg-luster-blue hover:bg-luster-blue-dark text-white py-4 text-lg font-semibold"
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Us About This Product
              </Button>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                  Description
                </h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {getDescriptionText(product.description)}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
