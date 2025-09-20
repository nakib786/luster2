import { NextResponse } from 'next/server';

interface WixProduct {
  id: string;
  name: string;
  description?: string;
  priceData?: {
    price?: number;
    discountedPrice?: number;
    formatted?: {
      price?: string;
      discountedPrice?: string;
    };
    currency?: string;
  };
  media?: {
    mainMedia?: {
      mediaType?: string;
      image?: {
        url: string;
        width?: number;
        height?: number;
        format?: string;
        altText?: string;
      };
      video?: {
        files?: Array<{
          url: string;
          width?: number;
          height?: number;
          format?: string;
        }>;
        stillFrameMediaId?: string;
      };
      thumbnail?: {
        url: string;
        width?: number;
        height?: number;
      };
      title?: string;
      id?: string;
    };
    items?: Array<{
      mediaType?: string;
      image?: {
        url: string;
        width?: number;
        height?: number;
        format?: string;
        altText?: string;
      };
      video?: {
        files?: Array<{
          url: string;
          width?: number;
          height?: number;
          format?: string;
        }>;
        stillFrameMediaId?: string;
      };
      thumbnail?: {
        url: string;
        width?: number;
        height?: number;
      };
      title?: string;
      id?: string;
    }>;
  };
  collectionIds?: string[];
  productOptions?: Array<{
    _id: string;
    name: string;
    choicesSettings?: {
      choices?: Array<{
        choiceId: string;
        name: string;
      }>;
    };
  }>;
  stock?: {
    inStock?: boolean;
  };
  sku?: string;
  ribbons?: Array<{ text: string }>;
}

interface WixCollection {
  id: string;
  name: string;
  slug: string;
  visible: boolean;
  image?: string;
  coverImage?: {
    url?: string;
    width?: number;
    height?: number;
  };
  media?: {
    mainMedia?: {
      image?: {
        url?: string;
      };
    };
  };
  description?: string;
  products?: WixProduct[];
}

export interface ProductResponse {
  success: boolean;
  data?: {
    products: WixProduct[];
    collections: WixCollection[];
    totalProducts: number;
  };
  error?: string;
}

// Wix Stores Integration - Products API using REST API directly
export async function GET(): Promise<NextResponse<ProductResponse>> {
  try {
    console.log('API Route: Starting products fetch...');
    
    // Use the correct site ID from wix.config.json
    const siteId = 'e3587e8a-ac64-44d8-952f-14001d3dd2f6';
    const accessToken = process.env.WIX_ACCESS_TOKEN;

    if (!accessToken) {
      console.log('Missing access token - returning error');
      return NextResponse.json(
        { success: false, error: 'Wix access token not configured. Please set WIX_ACCESS_TOKEN environment variable.' } as ProductResponse,
        { status: 500 }
      );
    }

    console.log('Fetching products from Wix REST API...');
    
    // Fetch products
    const productsResponse = await fetch('https://www.wixapis.com/stores/v1/products/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'wix-site-id': siteId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
          paging: { limit: 50 }
        }
      })
    });

    if (!productsResponse.ok) {
      throw new Error(`Products API error: ${productsResponse.status} ${productsResponse.statusText}`);
    }

    const productsData = await productsResponse.json();
    console.log('Products fetched:', productsData.products.length);
    
    // Log media information for debugging
    if (productsData.products.length > 0) {
      const sampleProduct = productsData.products[0];
      console.log('Sample product media:', JSON.stringify(sampleProduct.media, null, 2));
    }

    // Fetch collections with all fields
    const collectionsResponse = await fetch('https://www.wixapis.com/stores/v1/collections/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'wix-site-id': siteId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
          paging: { limit: 50 }
        },
        // Request all available fields including media
        fields: ['id', 'name', 'slug', 'visible', 'coverImage', 'media', 'description']
      })
    });

    if (!collectionsResponse.ok) {
      throw new Error(`Collections API error: ${collectionsResponse.status} ${collectionsResponse.statusText}`);
    }

    const collectionsData = await collectionsResponse.json();
    console.log('Collections fetched:', collectionsData.collections.length);
    
    // Debug: Log the structure of the first collection to see what fields are available
    if (collectionsData.collections.length > 0) {
      console.log('Sample collection structure:', JSON.stringify(collectionsData.collections[0], null, 2));
    }

    // Transform the data to match the expected format
    const transformedProducts = productsData.products.map((product: WixProduct) => ({
      _id: product.id,
      id: product.id,
      name: product.name,
      description: product.description || '',
      actualPriceRange: {
        minValue: {
          amount: product.priceData?.discountedPrice?.toString() || product.priceData?.price?.toString() || '0'
        }
      },
      compareAtPriceRange: (product.priceData?.price !== product.priceData?.discountedPrice && product.priceData?.price) ? {
        minValue: {
          amount: product.priceData.price.toString()
        }
      } : undefined,
      media: {
        main: {
          image: product.media?.mainMedia?.mediaType === 'image' ? product.media?.mainMedia?.image?.url || null : null,
          video: product.media?.mainMedia?.mediaType === 'video' && product.media?.mainMedia?.video?.files?.[0] ? product.media?.mainMedia?.video?.files[0].url : null,
          videoPoster: product.media?.mainMedia?.mediaType === 'video' ? product.media?.mainMedia?.thumbnail?.url || null : null
        },
        itemsInfo: {
          items: product.media?.items?.map((item) => {
            if (item.mediaType === 'image' && item.image) {
              return {
                image: item.image.url,
                video: null,
                videoPoster: null,
                mediaType: 'IMAGE'
              };
            } else if (item.mediaType === 'video' && item.video) {
              return {
                image: null,
                video: item.video.files?.[0]?.url || null,
                videoPoster: item.thumbnail?.url || null,
                mediaType: 'VIDEO'
              };
            }
            return null;
          }).filter(item => item !== null && (item.image || item.video)) || [] // Only include items with actual media
        }
      },
      options: product.productOptions || [],
      categories: product.collectionIds?.map((id: string) => ({ _id: id, name: '' })) || [],
      allCategoriesInfo: {
        categories: product.collectionIds?.map((id: string) => ({ _id: id, index: 0 })) || []
      },
      collections: product.collectionIds || [],
      inStock: product.stock?.inStock ?? true,
      sku: product.sku || '',
      ribbons: product.ribbons || [],
      formattedPrice: product.priceData?.formatted?.discountedPrice || product.priceData?.formatted?.price || null,
      currency: product.priceData?.currency || 'CAD'
    }));

    const transformedCollections = collectionsData.collections
      .filter((col: WixCollection) => col.id !== '00000000-000000-000000-000000000001') // Exclude "All Products" collection
      .map((col: WixCollection) => {
        // Try to get collection image from multiple possible sources
        let collectionImage = null;
        
        // 1. Try coverImage first (most likely for Wix collections)
        if (col.coverImage?.url) {
          collectionImage = col.coverImage.url;
        }
        // 2. Try media.mainMedia.image
        else if (col.media?.mainMedia?.image?.url) {
          collectionImage = col.media.mainMedia.image.url;
        }
        // 3. Try direct image field
        else if (col.image) {
          collectionImage = col.image;
        }
        // 4. Fallback to best product image from collection
        else {
          const collectionProducts = transformedProducts.filter((product: { collections: string[] }) => product.collections.includes(col.id));
          if (collectionProducts.length > 0) {
            // Find the product with the best image (prefer products with images)
            const productWithImage = collectionProducts.find((product: { media?: { main?: { image?: string } } }) => product.media?.main?.image);
            collectionImage = productWithImage?.media?.main?.image || collectionProducts[0].media?.main?.image;
          }
        }
        
        const collectionProducts = transformedProducts.filter((product: { collections: string[] }) => product.collections.includes(col.id));
        
        // Debug: Log collection image info
        console.log(`Collection "${col.name}" image sources:`, {
          coverImage: col.coverImage?.url,
          mediaImage: col.media?.mainMedia?.image?.url,
          directImage: col.image,
          fallbackImage: collectionImage,
          finalImage: collectionImage
        });
        
        return {
          _id: col.id,
          id: col.id,
          name: col.name,
          slug: col.slug,
          visible: col.visible,
          image: collectionImage,
          description: `Explore our beautiful ${col.name.toLowerCase()} collection`,
          products: collectionProducts
        };
      });

    // Add "All Products" collection at the beginning
    const allProductsImage = transformedProducts.length > 0 ? transformedProducts[0].media?.main?.image : null;
    transformedCollections.unshift({
      _id: 'all',
      id: 'all',
      name: 'All Products',
      slug: 'all-products',
      visible: true,
      image: allProductsImage,
      description: 'Explore our complete collection of exquisite jewelry pieces',
      products: transformedProducts
    });

    const responseData = {
      products: transformedProducts,
      collections: transformedCollections,
      totalProducts: transformedProducts.length
    };

    console.log(`Returning ${responseData.totalProducts} products and ${transformedCollections.length} collections`);
    
    return NextResponse.json({
      success: true,
      data: responseData,
    } as ProductResponse);
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}` } as ProductResponse,
      { status: 500 }
    );
  }
}
