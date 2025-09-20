'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Check, Phone, ZoomIn } from 'lucide-react';
import CallbackForm from './CallbackForm';

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
      video?: string;
      videoPoster?: string;
    };
    itemsInfo?: {
      items?: Array<{
        image?: string;
        video?: string;
        videoPoster?: string;
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
  inStock?: boolean;
  sku?: string;
  ribbons?: Array<{ text: string } | string>;
  formattedPrice?: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isCallbackFormOpen, setIsCallbackFormOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && product) {
      setSelectedOptions({});
      setSelectedImageIndex(0);
      setIsZoomed(false);
      setIsCallbackFormOpen(false);
    }
  }, [isOpen, product]);


  // Get all product media (images and videos)
  const productMedia = useMemo(() => {
    if (!product?.media) return [];
    
    console.log('ProductModal: Product media data:', product.media);
    
    const media = [];
    
    // Add main media (image or video)
    if (product.media.main?.image) {
      console.log('ProductModal: Adding main image:', product.media.main.image);
      media.push({
        type: 'image',
        url: product.media.main.image,
        index: 0
      });
    } else if (product.media.main?.video) {
      console.log('ProductModal: Adding main video:', product.media.main.video, 'with poster:', product.media.main.videoPoster);
      media.push({
        type: 'video',
        url: product.media.main.video,
        poster: product.media.main.videoPoster,
        index: 0
      });
    }
    
    // Add gallery media (images and videos)
    if (product.media.itemsInfo?.items) {
      console.log('ProductModal: Gallery items:', product.media.itemsInfo.items);
      product.media.itemsInfo.items
        .filter(item => item.image || item.video) // Include items with images or videos
        .forEach((item, index) => {
          if (item.image) {
            console.log('ProductModal: Adding gallery image:', item.image);
            media.push({
              type: 'image',
              url: item.image,
              index: index + 1
            });
          } else if (item.video) {
            console.log('ProductModal: Adding gallery video:', item.video, 'with poster:', item.videoPoster);
            media.push({
              type: 'video',
              url: item.video,
              poster: item.videoPoster,
              index: index + 1
            });
          }
        });
    }
    
    // Remove duplicates by URL
    const uniqueMedia = media.filter((item, index, self) => 
      index === self.findIndex(t => t.url === item.url)
    );
    
    console.log('ProductModal: Final media array:', uniqueMedia);
    return uniqueMedia;
  }, [product]);

  // Handle media navigation
  const handleImageNavigation = useCallback((direction: 'prev' | 'next') => {
    if (productMedia.length <= 1) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(prev => prev > 0 ? prev - 1 : productMedia.length - 1);
    } else {
      setSelectedImageIndex(prev => prev < productMedia.length - 1 ? prev + 1 : 0);
    }
  }, [productMedia.length]);

  // Keyboard navigation for media
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || productMedia.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleImageNavigation('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleImageNavigation('next');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, productMedia.length, handleImageNavigation]);

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && productMedia.length > 1) {
      handleImageNavigation('next');
    }
    if (isRightSwipe && productMedia.length > 1) {
      handleImageNavigation('prev');
    }
  };

  // Generate safe key for product elements
  const getSafeProductKey = (suffix: string) => {
    const productId = product?._id || product?.name || 'unknown-product';
    const safeProductId = productId.toString().replace(/[^a-zA-Z0-9]/g, '-');
    return `${safeProductId}-${suffix}`;
  };


  // Extract text from rich text description
  const getDescriptionText = (desc: unknown): string => {
    if (typeof desc === 'string') return desc;
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
    
    if (product?.formattedPrice) {
      return product.formattedPrice;
    }
    
    return 'Price unavailable';
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

  // Check if product is on sale
  const isProductOnSale = () => {
    // Check if product has ribbons indicating sale
    if (product?.ribbons && product.ribbons.length > 0) {
      return true;
    }
    
    // Check if product has compare at price (automatic sale detection)
    if (product?.compareAtPriceRange?.minValue?.amount) {
      const comparePrice = parseFloat(product.compareAtPriceRange.minValue.amount);
      const currentPrice = parseFloat(product.actualPriceRange?.minValue?.amount || '0');
      return comparePrice > currentPrice && currentPrice > 0;
    }
    
    return false;
  };

  // Get sale ribbon text
  const getSaleRibbonText = () => {
    // If product has custom ribbons, use them
    if (product?.ribbons && product.ribbons.length > 0) {
      return product.ribbons.map(ribbon => 
        typeof ribbon === 'string' ? ribbon : ribbon.text
      );
    }
    
    // If product is on sale based on price comparison, add "Sale" ribbon
    if (isProductOnSale() && product?.compareAtPriceRange?.minValue?.amount) {
      const comparePrice = parseFloat(product.compareAtPriceRange.minValue.amount);
      const currentPrice = parseFloat(product.actualPriceRange?.minValue?.amount || '0');
      const discountPercent = Math.round(((comparePrice - currentPrice) / comparePrice) * 100);
      return [`${discountPercent}% OFF`];
    }
    
    return [];
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

  // Handle modal close
  const handleClose = () => {
    setIsZoomed(false);
    onClose();
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-7xl max-h-[95vh] mx-4 bg-white rounded-xl lg:rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>

            <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
              {/* Left Side - Product Images */}
              <div className="w-full lg:w-1/2 bg-white p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row gap-4 h-full">
                  {/* Main Image */}
                  <div className="flex-1 flex items-center justify-center min-h-[300px] sm:min-h-0">
                    <div 
                      className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 shadow-lg relative group"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {productMedia.length > 0 ? (
                        <>
                          {productMedia[selectedImageIndex]?.type === 'video' ? (
                            <div className="relative w-full h-full bg-black">
                              <video
                                key={`video-${selectedImageIndex}-${productMedia[selectedImageIndex].url}`}
                                src={productMedia[selectedImageIndex].url}
                                controls
                                className="w-full h-full object-contain"
                                poster={productMedia[selectedImageIndex].poster}
                                preload="auto"
                                playsInline
                                webkit-playsinline="true"
                                onError={(e) => {
                                  console.error('Video error:', e);
                                  console.error('Video URL:', productMedia[selectedImageIndex].url);
                                }}
                                onLoadStart={() => {
                                  console.log('Video loading:', productMedia[selectedImageIndex].url);
                                }}
                                onCanPlay={() => {
                                  console.log('Video ready:', productMedia[selectedImageIndex].url);
                                }}
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <motion.img
                              key={selectedImageIndex}
                              src={productMedia[selectedImageIndex]?.url}
                              alt={String(product.name || 'Product')}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className={`w-full h-full object-cover transition-transform duration-300 ${
                                isZoomed ? 'scale-150' : 'group-hover:scale-105'
                              }`}
                            />
                          )}
                          
                          {/* Media Navigation Controls */}
                          {productMedia.length > 1 && (
                            <div className={`absolute inset-0 flex items-center justify-between p-4 transition-opacity duration-300 ${
                              isHovered ? 'opacity-100' : 'opacity-0'
                            }`}>
                              <button
                                onClick={() => handleImageNavigation('prev')}
                                className="p-3 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 border border-gray-200"
                              >
                                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleImageNavigation('next')}
                                className="p-3 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 border border-gray-200"
                              >
                                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          )}
                          
                          {/* Zoom Button */}
                          <button
                            onClick={() => setIsZoomed(!isZoomed)}
                            className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <ZoomIn className="h-5 w-5 text-gray-600" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Media - Responsive Stack */}
                  {productMedia.length > 1 && (
                    <div className="w-16 sm:w-20 flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible">
                      {productMedia.map((media, index) => {
                        const safeUrl = media?.url?.trim() || 'no-media';
                        const urlSnippet = safeUrl.substring(0, 10) || 'no-media';
                        return (
                          <button
                            key={getSafeProductKey(`thumb-${index}-${urlSnippet}`)}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`w-16 sm:w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 relative flex-shrink-0 ${
                              selectedImageIndex === index
                                ? 'border-luster-blue ring-2 ring-luster-blue/20 shadow-lg'
                                : 'border-gray-200 hover:border-luster-blue/50'
                            }`}
                          >
                            {media.type === 'video' ? (
                              <>
                                <video
                                  src={media.url}
                                  className="w-full h-full object-cover"
                                  muted
                                  preload="none"
                                  playsInline
                                  poster={media.poster}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z"/>
                                    </svg>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <img
                                src={media.url}
                                alt={`${String(product.name || 'Product')} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Product Details */}
              <div className="w-full lg:w-1/2 bg-gray-50 p-4 lg:p-6 overflow-y-auto max-h-[50vh] lg:max-h-none">
                <div className="space-y-6">
                  {/* Product Title and Price */}
                  <div>
                    {/* Sale Ribbons */}
                    {getSaleRibbonText().length > 0 && (
                      <div className="mb-4">
                        {getSaleRibbonText().map((ribbonText: string, ribbonIndex: number) => {
                          const safeRibbonText = ribbonText?.trim() || 'ribbon';
                          const textSnippet = safeRibbonText.substring(0, 10) || 'ribbon';
                          return (
                            <span
                              key={getSafeProductKey(`ribbon-${ribbonIndex}-${textSnippet}`)}
                              className="inline-block bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg mr-2"
                            >
                              {ribbonText}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-luster-blue mb-4">
                      {String(product.name || 'Unnamed Product')}
                    </h1>
                    
                    {/* Price */}
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-luster-blue">
                        {getCurrentPrice()}
                      </span>
                      {getCompareAtPrice() && (
                        <span className="text-lg text-gray-500 line-through">
                          {getCompareAtPrice()}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 mb-4">
                      {product.inStock !== false ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">In Stock</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <X className="h-4 w-4" />
                          <span className="text-sm font-medium">Out of Stock</span>
                        </div>
                      )}
                      {product.sku && (
                        <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                      )}
                    </div>
                  </div>

                  {/* Product Options */}
                  {product.options && product.options.length > 0 && (
                    <div className="space-y-4">
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
                                  className={`px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                                    isSelected
                                      ? 'border-luster-blue bg-luster-blue text-white'
                                      : isAvailable
                                      ? 'border-gray-200 hover:border-luster-blue hover:text-luster-blue'
                                      : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    {String(choice.name)}
                                    {!isAvailable && <X className="h-3 w-3" />}
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

                  {/* Action Button */}
                  <div className="pt-4">
                    <Button
                      onClick={() => setIsCallbackFormOpen(true)}
                      className="w-full bg-luster-blue hover:bg-luster-blue-dark text-white py-3 text-sm sm:text-base font-semibold"
                    >
                      <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Request a Consultation
                    </Button>
                  </div>

                  {/* Product Description */}
                  {product.description && (
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-lg text-gray-900 mb-3">
                        Description
                      </h3>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                          {getDescriptionText(product.description)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Callback Form Modal */}
      <CallbackForm 
        isOpen={isCallbackFormOpen} 
        onClose={() => setIsCallbackFormOpen(false)} 
      />
    </AnimatePresence>
  );
};

export default ProductModal;
