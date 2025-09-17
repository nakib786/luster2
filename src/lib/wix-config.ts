// Wix configuration helper with better error handling
import wixConfig from '../../wix.config.json';

export interface WixConfig {
  clientId: string;
  siteId: string;
  apiKey?: string;
}

export function getWixConfig(): WixConfig {
  const config: WixConfig = {
    clientId: process.env.WIX_CLIENT_ID || '8a36ba43-6e83-4992-bc2c-8ebd8726f85b',
    siteId: process.env.WIX_SITE_ID || wixConfig.siteId || '',
    apiKey: process.env.WIX_API_KEY,
  };

  // Validate configuration
  const errors: string[] = [];
  
  if (!config.siteId) {
    errors.push('Wix Site ID is missing. Please set WIX_SITE_ID environment variable or configure it in wix.config.json');
  }
  
  if (!config.apiKey) {
    errors.push('Wix API Key is missing. Please set WIX_API_KEY environment variable');
  }

  if (errors.length > 0) {
    console.error('Wix Configuration Errors:', errors);
    throw new Error(`Wix configuration is incomplete:\n${errors.join('\n')}\n\nPlease check the WIX_SETUP.md file for setup instructions.`);
  }

  return config;
}

export function isWixConfigured(): boolean {
  try {
    getWixConfig();
    return true;
  } catch {
    return false;
  }
}

export function getWixConfigError(): string | null {
  try {
    getWixConfig();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : 'Unknown configuration error';
  }
}
