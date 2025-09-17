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
      
      // Fetch products using Wix SDK (V1 - legacy)
      console.log('WixApiClient: Fetching products using Wix SDK V1...');
      const { items: products } = await this.wixClient.products.queryProducts().find();
      console.log('WixApiClient: Products fetched, count:', products?.length || 0);
      
      // Fetch collections using Wix SDK
      console.log('WixApiClient: Fetching collections...');
      const { items: collections } = await this.wixClient.collections.queryCollections().find();
      console.log('WixApiClient: Collections fetched, count:', collections?.length || 0);
      console.log('WixApiClient: Collections data:', collections);

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
      const transformedProducts = products.map(product => this.transformProduct(product));
    
    const transformedCollections = collections.map((collection, index) => ({
      id: (collection.id as string) || `collection-${index}`,
      name: collection.name as string,
      description: (collection.description as string) || '',
      slug: (collection.slug as string) || '',
      images: this.extractWixCollectionImages(collection),
      products: transformedProducts.filter(product => 
        product.collections?.includes(collection.id as string)
      ),
    }));

    // Add an "All Products" collection
    transformedCollections.unshift({
      id: 'all',
      name: 'All Products',
      description: 'Browse our complete product catalog',
      slug: 'all',
      images: [], // Add empty images array for the "All Products" collection
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
      // Wix V1 products have a different structure
      const media = product.media as Record<string, unknown> || {};
      const stock = product.stock as Record<string, unknown> || {};
      const priceData = product.priceData as Record<string, unknown> || {};
      
      return {
      id: (product.id as string) || (product._id as string) || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: (product.name as string) || 'Unnamed Product',
      description: (product.description as string) || '',
      price: parseFloat((priceData.discountedPrice as string) || (priceData.price as string) || '0'),
      compareAtPrice: priceData.price !== priceData.discountedPrice ? parseFloat((priceData.price as string) || '0') : undefined,
      images: this.extractWixV1ProductImages(media),
      inStock: stock.inventoryStatus === 'IN_STOCK',
      sku: (product.sku as string) || '',
      weight: (product.weight as number) || 0,
      collections: (product.collectionIds as string[]) || [],
      variants: (product.variants as Record<string, unknown>[]) || [],
      options: (product.productOptions as Record<string, unknown>[]) || [],
      customTextFields: (product.customTextFields as Record<string, unknown>[]) || [],
      additionalInfoSections: (product.additionalInfoSections as Record<string, unknown>[]) || [],
      ribbon: (product.ribbon as string) || '',
      brand: '', // V1 doesn't have brand at product level
      slug: (product.slug as string) || '',
    };
    } catch (error) {
      console.error('WixApiClient: Error transforming individual product:', product, error);
      return {
        id: `error-product-${Date.now()}`,
        name: 'Error Product',
        description: 'Error loading product',
        price: 0,
        compareAtPrice: undefined,
        images: [],
        inStock: false,
        sku: '',
        weight: 0,
        collections: [],
        variants: [],
        options: [],
        customTextFields: [],
        additionalInfoSections: [],
        ribbon: '',
        brand: '',
        slug: '',
      };
    }
  }

  private extractWixV1ProductImages(media: Record<string, unknown>): string[] {
    const items = media.items as Record<string, unknown>[] || [];
    
    return items
      .filter(item => item.mediaType === 'image')
      .map(item => {
        const image = item.image as Record<string, unknown>;
        return image?.url as string || '';
      })
      .filter(Boolean);
  }

  private extractWixCollectionImages(collection: Record<string, unknown>): string[] {
    try {
      console.log('WixApiClient: Extracting images for collection:', collection.name);
      console.log('WixApiClient: Collection data structure:', Object.keys(collection));
      
      // Try different possible image fields in Wix collections
      const media = collection.media as Record<string, unknown>;
      const image = collection.image as Record<string, unknown>;
      const coverImage = collection.coverImage as Record<string, unknown>;
      const thumbnail = collection.thumbnail as Record<string, unknown>;
      
      console.log('WixApiClient: Media field:', media);
      console.log('WixApiClient: Image field:', image);
      console.log('WixApiClient: CoverImage field:', coverImage);
      console.log('WixApiClient: Thumbnail field:', thumbnail);
      
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
        console.log('WixApiClient: Found images in media.items:', images);
        return images;
      }
      
      // Check direct image fields
      const imageFields = [image, coverImage, thumbnail];
      for (const imgField of imageFields) {
        if (imgField && imgField.url) {
          console.log('WixApiClient: Found image in direct field:', imgField.url);
          return [imgField.url as string];
        }
      }
      
      // Check if collection has a direct image URL
      if (collection.imageUrl) {
        console.log('WixApiClient: Found imageUrl:', collection.imageUrl);
        return [collection.imageUrl as string];
      }
      
      // Check if collection has an images array
      if (collection.images && Array.isArray(collection.images)) {
        const images = (collection.images as string[]).filter(Boolean);
        console.log('WixApiClient: Found images array:', images);
        return images;
      }
      
      console.log('WixApiClient: No images found for collection:', collection.name);
      return [];
    } catch (error) {
      console.error('WixApiClient: Error extracting collection images:', error);
      return [];
    }
  }

  // Create order in Wix Stores
  async createOrder(orderData: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      // Order payload for future Wix Stores API integration
      // const orderPayload = {
      //   buyerInfo: orderData.customerInfo,
      //   lineItems: (orderData.items as Record<string, unknown>[]).map(item => ({
      //     productId: item.productId,
      //     quantity: item.quantity,
      //     price: item.price,
      //     variantId: item.selectedVariant ? (item.selectedVariant as Record<string, unknown>).id : undefined,
      //     options: item.selectedOptions || {},
      //     customTextFields: item.customTextFields || {},
      //     notes: item.notes || '',
      //   })),
      //   shippingInfo: {
      //     deliveryOption: orderData.shippingOption,
      //     shippingAddress: orderData.shippingAddress,
      //     shippingInstructions: orderData.shippingInstructions,
      //   },
      //   billingInfo: {
      //     billingAddress: orderData.billingAddress || orderData.shippingAddress,
      //   },
      //   totals: {
      //     subtotal: orderData.subtotal,
      //     tax: orderData.tax,
      //     shipping: orderData.shippingFee || 0,
      //     total: orderData.total,
      //   },
      // };

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
