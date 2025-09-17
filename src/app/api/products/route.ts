import { NextResponse } from 'next/server';
import { wixApiClient } from '@/lib/wix-api';

export interface ProductResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

// Wix Stores Integration - Products API
export async function GET(): Promise<NextResponse<ProductResponse>> {
  try {
    console.log('API Route: Starting products fetch...');
    
    const clientId = process.env.WIX_CLIENT_ID;
    const siteId = process.env.WIX_SITE_ID;

    console.log('Environment variables check:');
    console.log('- WIX_CLIENT_ID exists:', !!clientId);
    console.log('- WIX_SITE_ID exists:', !!siteId);

    if (!clientId || !siteId) {
      console.log('Missing credentials - returning error');
      return NextResponse.json(
        { success: false, error: 'Wix credentials not configured. Please set WIX_CLIENT_ID and WIX_SITE_ID environment variables.' } as ProductResponse,
        { status: 500 }
      );
    }

    console.log('Calling wixApiClient.getProducts()...');
    const productData = await wixApiClient.getProducts();
    console.log('Product data response:', productData);

    if (!productData.success) {
      console.log('Product data fetch failed:', productData.error);
      return NextResponse.json(
        { success: false, error: productData.error || 'Failed to fetch product data' } as ProductResponse,
        { status: 500 }
      );
    }

    console.log('Returning successful product data');
    return NextResponse.json({
      success: true,
      data: productData.data,
    } as ProductResponse);
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { success: false, error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` } as ProductResponse,
      { status: 500 }
    );
  }
}
