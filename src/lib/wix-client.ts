import { createClient, ApiKeyStrategy } from '@wix/sdk';
import { products, collections } from '@wix/stores';

// Get site ID from environment or config
const getSiteId = () => {
  return process.env.WIX_SITE_ID || '';
};

// Get API key from environment
const getApiKey = () => {
  return process.env.WIX_API_KEY || '';
};

// Create Wix client with proper error handling
let wixClient: ReturnType<typeof createClient> | null = null;

try {
  const siteId = getSiteId();
  const apiKey = getApiKey();
  
  if (siteId && apiKey) {
    // Initialize Wix client with API key authentication
    wixClient = createClient({
      modules: { products, collections },
      auth: ApiKeyStrategy({ 
        apiKey: apiKey,
        siteId: siteId 
      }),
    });
    console.log('Wix client initialized successfully with authentication');
  } else {
    console.warn('Wix credentials not configured. Please set WIX_SITE_ID and WIX_API_KEY environment variables.');
    wixClient = null;
  }
} catch (error) {
  console.error('Error creating Wix client:', error);
  // Set wixClient to null to trigger fallback
  wixClient = null;
}

export { wixClient };

// Export individual modules for easier use
export { products, collections };
