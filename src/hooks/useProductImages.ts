import { useState, useEffect } from 'react';

interface ProductImage {
  url: string;
  alt: string;
  productId: string;
  productName: string;
}

interface ProductMedia {
  main?: {
    image?: string;
  };
  itemsInfo?: {
    items?: Array<{
      image?: string;
      mediaType?: string;
    }>;
  };
}

interface Product {
  id: string;
  name: string;
  media?: ProductMedia;
}

interface UseProductImagesReturn {
  images: ProductImage[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProductImages = (): UseProductImagesReturn => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch products');
      }
      
      // Extract all product images
      const productImages: ProductImage[] = [];
      
      if (data.data?.products) {
        data.data.products.forEach((product: Product) => {
          // Add main product image
          if (product.media?.main?.image) {
            productImages.push({
              url: product.media.main.image,
              alt: product.name || 'Product image',
              productId: product.id,
              productName: product.name
            });
          }
          
          // Add additional product images from itemsInfo
          if (product.media?.itemsInfo?.items) {
            product.media.itemsInfo.items.forEach((item) => {
              if (item.image && item.mediaType === 'IMAGE') {
                productImages.push({
                  url: item.image,
                  alt: `${product.name} - Additional view`,
                  productId: product.id,
                  productName: product.name
                });
              }
            });
          }
        });
      }
      
      // Remove duplicate images (same URL)
      const uniqueImages = productImages.filter((image, index, self) => 
        index === self.findIndex(img => img.url === image.url)
      );
      
      setImages(uniqueImages);
    } catch (err) {
      console.error('Error fetching product images:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product images');
      
      // Fallback to static images if API fails
      setImages([
        {
          url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          alt: "Luxury jewelry 1",
          productId: "fallback-1",
          productName: "Fallback Image 1"
        },
        {
          url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          alt: "Luxury jewelry 2",
          productId: "fallback-2",
          productName: "Fallback Image 2"
        },
        {
          url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          alt: "Luxury jewelry 3",
          productId: "fallback-3",
          productName: "Fallback Image 3"
        },
        {
          url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
          alt: "Luxury jewelry 4",
          productId: "fallback-4",
          productName: "Fallback Image 4"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductImages();
  }, []);

  return {
    images,
    loading,
    error,
    refetch: fetchProductImages
  };
};
