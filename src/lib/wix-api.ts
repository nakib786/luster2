// Wix API utility functions
// Updated to use official Wix SDK for e-commerce product catalog integration

import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { products, collections } from '@wix/stores';

export interface WixApiConfig {
  clientId: string;
  siteId: string;
  apiKey?: string;
}

export class WixApiClient {
  private config: WixApiConfig;
  private wixClient: ReturnType<typeof createClient>;

  constructor(config: WixApiConfig) {
    this.config = config;
    
    console.log('WixApiClient: Initializing with siteId:', config.siteId);
    
    // Validate required configuration
    if (!config.siteId) {
      console.error('WixApiClient: Site ID is required but not provided');
      throw new Error('Wix Site ID is required. Please set WIX_SITE_ID environment variable or configure it in wix.config.json');
    }
    
    if (!config.apiKey && !process.env.WIX_API_KEY) {
      console.error('WixApiClient: API Key is required but not provided');
      throw new Error('Wix API Key is required. Please set WIX_API_KEY environment variable');
    }
    
    // Initialize Wix client with API key authentication
    this.wixClient = createClient({
      modules: { products, collections },
      auth: ApiKeyStrategy({ 
        apiKey: config.apiKey || process.env.WIX_API_KEY || '',
        siteId: config.siteId 
      }),
    });
  }

  // Fetch product catalog from Wix Stores API using official SDK
  async getProducts(): Promise<Record<string, unknown>> {
    try {
      console.log('WixApiClient: Starting product fetch...');
      console.log('WixApiClient: Config check - clientId exists:', !!this.config.clientId);
      console.log('WixApiClient: Config check - siteId exists:', !!this.config.siteId);
      console.log('WixApiClient: Config check - apiKey exists:', !!this.config.apiKey);
      console.log('WixApiClient: Site ID from config:', this.config.siteId);
      
      // Fetch collections first (all collections, will filter by visibility later)
      console.log('WixApiClient: Fetching collections...');
      const collectionsResponse = await this.wixClient.collections.queryCollections().find();
      const collections = collectionsResponse.items || [];
      console.log('WixApiClient: Collections fetched, count:', collections.length);
      
      // Fetch products (all products, will filter by visibility later)
      console.log('WixApiClient: Fetching products...');
      const productsResponse = await this.wixClient.products.queryProducts().find();
      const products = productsResponse.items || [];
      console.log('WixApiClient: Products fetched, count:', products.length);

      // Transform data to our format
      console.log('WixApiClient: Transforming data...');
      const transformedCatalog = this.transformWixProductData(products, collections);
      console.log('WixApiClient: Data transformation complete');

      return {
        success: true,
        data: transformedCatalog,
      };
    } catch (error) {
      console.error('WixApiClient: Error fetching products:', error);
      return {
        success: false,
        error: `Failed to fetch product data from Wix: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Transform Wix V1 product data to our application format
  private transformWixProductData(products: Record<string, unknown>[], collections: Record<string, unknown>[]) {
    try {
      // Filter only visible products (frontend filtering for Catalog V1)
      const visibleProducts = products.filter(product => (product.visible as boolean) === true);
      console.log(`WixApiClient: Filtered products: ${products.length} total, ${visibleProducts.length} visible`);
      
      const transformedProducts = visibleProducts.map(product => this.transformProduct(product));
    
      // Filter only visible collections
      const visibleCollections = collections.filter(collection => (collection.visible as boolean) === true);
      console.log(`WixApiClient: Filtered collections: ${collections.length} total, ${visibleCollections.length} visible`);
    
      const transformedCollections = visibleCollections.map((collection, index) => {
        const collectionId = (collection.id as string) || (collection._id as string);
        const filteredProducts = transformedProducts.filter(product => {
          const collections = product.collections as string[] | undefined;
          return collections && collections.includes(collectionId);
        });
        console.log(`WixApiClient: Collection "${collection.name}" (${collectionId}) has ${filteredProducts.length} products`);
        
        return {
          _id: collectionId || `collection-${index}`,
          id: collectionId || `collection-${index}`,
          name: collection.name as string,
          description: (collection.description as string) || '',
          slug: (collection.slug as string) || '',
          visible: (collection.visible as boolean) !== false, // Default to true if not specified
          images: this.extractWixCollectionImages(collection),
          products: filteredProducts,
        };
      });

      // Add an "All Products" collection
      transformedCollections.unshift({
        _id: 'all',
        id: 'all',
        name: 'All Products',
        description: 'Browse our complete product catalog',
        slug: 'all',
        visible: true,
        images: [],
        products: transformedProducts,
      });

      return {
        collections: transformedCollections,
        totalProducts: transformedProducts.length,
      };
    } catch (error) {
      console.error('WixApiClient: Error in data transformation:', error);
      return {
        collections: [],
        totalProducts: 0,
      };
    }
  }

  // Transform individual Wix V1 product
  private transformProduct(product: Record<string, unknown>) {
    try {
      // Wix V1 products structure
      const media = product.media as Record<string, unknown> || {};
      const stock = product.stock as Record<string, unknown> || {};
      const priceData = product.priceData as Record<string, unknown> || {};
      
      // Extract price values correctly
      const discountedPrice = String(priceData.discountedPrice || priceData.price || '0');
      const regularPrice = String(priceData.price || '0');
      
      return {
        _id: (product.id as string) || (product._id as string) || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        id: (product.id as string) || (product._id as string) || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: (product.name as string) || 'Unnamed Product',
        description: (product.description as string) || '',
        actualPriceRange: {
          minValue: {
            amount: discountedPrice
          }
        },
        compareAtPriceRange: (priceData.price !== priceData.discountedPrice && priceData.price) ? {
          minValue: {
            amount: regularPrice
          }
        } : undefined,
        media: {
          main: {
            image: this.extractWixV1ProductImages(media)?.[0] || '/placeholder-image.svg',
            video: this.extractWixV1ProductVideos(media)?.[0] || null,
            videoPoster: this.extractWixV1ProductVideoPosters(media)?.[0] || null
          },
          itemsInfo: {
            items: this.extractWixV1ProductMedia(media) || []
          }
        },
        options: (product.productOptions as Record<string, unknown>[]) || [],
        categories: (product.collectionIds as string[])?.map(id => ({ _id: id, name: '' })) || [],
        allCategoriesInfo: {
          categories: (product.collectionIds as string[])?.map(id => ({ _id: id, index: 0 })) || []
        },
        collections: (product.collectionIds as string[]) || [] as string[],
        inStock: stock.inventoryStatus === 'IN_STOCK',
        sku: (product.sku as string) || '',
        weight: (product.weight as number) || 0,
        variants: (product.variants as Record<string, unknown>[]) || [],
        customTextFields: (product.customTextFields as Record<string, unknown>[]) || [],
        additionalInfoSections: (product.additionalInfoSections as Record<string, unknown>[]) || [],
        ribbon: (product.ribbon as string) || '',
        brand: '',
        slug: (product.slug as string) || '',
      };
    } catch (error) {
      console.error('WixApiClient: Error transforming individual product:', product, error);
      return {
        _id: `error-product-${Date.now()}`,
        id: `error-product-${Date.now()}`,
        name: 'Error Product',
        description: 'Error loading product',
        actualPriceRange: { minValue: { amount: '0' } },
        compareAtPriceRange: undefined,
        media: { main: { image: '' }, itemsInfo: { items: [] } },
        options: [],
        categories: [],
        allCategoriesInfo: { categories: [] },
        collections: [],
        inStock: false,
        sku: '',
        weight: 0,
        variants: [],
        customTextFields: [],
        additionalInfoSections: [],
        ribbon: '',
        brand: '',
        slug: '',
      };
    }
  }

  private extractWixV1ProductImages(media: Record<string, unknown>): string[] {
    try {
      const images: string[] = [];
      
      // Check mainMedia first
      const mainMedia = media.mainMedia as Record<string, unknown>;
      if (mainMedia && mainMedia.image) {
        const mainImage = mainMedia.image as Record<string, unknown>;
        if (mainImage.url) {
          images.push(mainImage.url as string);
        }
      }
      
      // Then check items array
      const items = media.items as Record<string, unknown>[] || [];
      const itemImages = items
        .filter(item => item.mediaType === 'image')
        .map(item => {
          const image = item.image as Record<string, unknown>;
          return image?.url as string || '';
        })
        .filter(Boolean);
      
      // Add unique item images
      itemImages.forEach(img => {
        if (!images.includes(img)) {
          images.push(img);
        }
      });
      
      return images;
    } catch (error) {
      console.error('WixApiClient: Error extracting V1 product images:', error);
      return [];
    }
  }

  // Extract videos from Wix V1 product media
  private extractWixV1ProductVideos(media: Record<string, unknown>): string[] {
    try {
      const videos: string[] = [];
      
      // Check mainMedia first
      const mainMedia = media.mainMedia as Record<string, unknown>;
      if (mainMedia && mainMedia.video) {
        const mainVideo = mainMedia.video as Record<string, unknown>;
        if (mainVideo.url) {
          videos.push(mainVideo.url as string);
        }
      }
      
      // Then check items array
      const items = media.items as Record<string, unknown>[] || [];
      const itemVideos = items
        .filter(item => item.mediaType === 'video')
        .map(item => {
          const video = item.video as Record<string, unknown>;
          return video?.url as string || '';
        })
        .filter(Boolean);
      
      // Add unique item videos
      itemVideos.forEach(vid => {
        if (!videos.includes(vid)) {
          videos.push(vid);
        }
      });
      
      return videos;
    } catch (error) {
      console.error('WixApiClient: Error extracting V1 product videos:', error);
      return [];
    }
  }

  // Extract video posters from Wix V1 product media
  private extractWixV1ProductVideoPosters(media: Record<string, unknown>): string[] {
    try {
      const posters: string[] = [];
      
      // Check mainMedia first
      const mainMedia = media.mainMedia as Record<string, unknown>;
      if (mainMedia && mainMedia.video) {
        const mainVideo = mainMedia.video as Record<string, unknown>;
        if (mainVideo.poster) {
          posters.push(mainVideo.poster as string);
        }
      }
      
      // Then check items array
      const items = media.items as Record<string, unknown>[] || [];
      const itemPosters = items
        .filter(item => item.mediaType === 'video')
        .map(item => {
          const video = item.video as Record<string, unknown>;
          return video?.poster as string || '';
        })
        .filter(Boolean);
      
      // Add unique item posters
      itemPosters.forEach(poster => {
        if (!posters.includes(poster)) {
          posters.push(poster);
        }
      });
      
      return posters;
    } catch (error) {
      console.error('WixApiClient: Error extracting V1 product video posters:', error);
      return [];
    }
  }

  // Extract all media (images and videos) from Wix V1 product media
  private extractWixV1ProductMedia(media: Record<string, unknown>): Array<{image?: string; video?: string; videoPoster?: string; mediaType?: string}> {
    try {
      const allMedia: Array<{image?: string; video?: string; videoPoster?: string; mediaType?: string}> = [];
      
      // Check mainMedia first
      const mainMedia = media.mainMedia as Record<string, unknown>;
      if (mainMedia) {
        if (mainMedia.image) {
          const mainImage = mainMedia.image as Record<string, unknown>;
          if (mainImage.url) {
            allMedia.push({
              image: mainImage.url as string,
              mediaType: 'IMAGE'
            });
          }
        }
        if (mainMedia.video) {
          const mainVideo = mainMedia.video as Record<string, unknown>;
          if (mainVideo.url) {
            allMedia.push({
              video: mainVideo.url as string,
              videoPoster: mainVideo.poster as string,
              mediaType: 'VIDEO'
            });
          }
        }
      }
      
      // Then check items array
      const items = media.items as Record<string, unknown>[] || [];
      items.forEach(item => {
        if (item.mediaType === 'image' && item.image) {
          const image = item.image as Record<string, unknown>;
          if (image.url) {
            allMedia.push({
              image: image.url as string,
              mediaType: 'IMAGE'
            });
          }
        } else if (item.mediaType === 'video' && item.video) {
          const video = item.video as Record<string, unknown>;
          if (video.url) {
            allMedia.push({
              video: video.url as string,
              videoPoster: video.poster as string,
              mediaType: 'VIDEO'
            });
          }
        }
      });
      
      return allMedia;
    } catch (error) {
      console.error('WixApiClient: Error extracting V1 product media:', error);
      return [];
    }
  }

  private extractWixCollectionImages(collection: Record<string, unknown>): string[] {
    try {
      console.log('WixApiClient: Extracting images for collection:', collection.name);
      
      // Try different possible image fields in Wix collections
      const media = collection.media as Record<string, unknown>;
      
      // Check if media has mainMedia (common structure)
      if (media && media.mainMedia) {
        const mainMedia = media.mainMedia as Record<string, unknown>;
        const image = mainMedia.image as Record<string, unknown>;
        if (image && image.url) {
          return [image.url as string];
        }
      }
      
      // Check if media has items array (similar to products)
      if (media && media.items) {
        const items = media.items as Record<string, unknown>[];
        const images = items
          .filter(item => item.mediaType === 'image')
          .map(item => {
            const img = item.image as Record<string, unknown>;
            return img?.url as string || '';
          })
          .filter(Boolean);
        if (images.length > 0) {
          return images;
        }
      }
      
      return [];
    } catch (error) {
      console.error('WixApiClient: Error extracting collection images:', error);
      return [];
    }
  }

  // Create order in Wix Stores
  async createOrder(orderData: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      // For now, returning mock response - in production, this would call Wix Stores API
      return {
        success: true,
        data: {
          id: `order_${Date.now()}`,
          ...orderData,
          status: 'pending',
          createdAt: new Date().toISOString(),
          trackingNumber: `TRK${Date.now()}`,
          estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        },
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: 'Failed to create order',
      };
    }
  }
}

// Import wix config helper
import { getWixConfig } from './wix-config';

// Create a singleton instance with proper error handling
let wixApiClient: WixApiClient;

try {
  const config = getWixConfig();
  wixApiClient = new WixApiClient(config);
} catch (error) {
  console.error('Failed to initialize Wix API client:', error);
  // Create a mock client that will show configuration errors
  wixApiClient = new WixApiClient({
    clientId: '8a36ba43-6e83-4992-bc2c-8ebd8726f85b',
    siteId: '',
    apiKey: '',
  });
}

export { wixApiClient };