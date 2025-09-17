# Wix API Setup Guide

## Prerequisites

1. **Wix Developer Account**: Sign up at [Wix Developer Center](https://dev.wix.com/)
2. **Wix Store**: You need an active Wix store with products

## Step 1: Get Your Client ID

1. **Log in** to [Wix Developer Center](https://dev.wix.com/)
2. **Create or Access Your App:**
   - Create a new app or use an existing one
   - Go to your app's dashboard
3. **Copy Client ID:**
   - The Client ID is already configured for this project: `8a36ba43-6e83-4992-bc2c-8ebd8726f85b`
   - You can find it in your app's settings if needed

## Step 2: Get Your Site ID

### Get Site ID:
1. **Go to your Wix Dashboard:**
   - Navigate to your site's dashboard
2. **Check the URL:**
   - Look at your browser's address bar
   - URL format: `https://www.wix.com/dashboard/YOUR_SITE_ID_HERE`
3. **Copy the Site ID:**
   - Copy the string after `/dashboard/`

## Step 3: Get Your API Key

1. **Go to Wix Developer Center:**
   - Navigate to your app settings
2. **Generate API Key:**
   - Go to the API Keys section
   - Generate a new API key or use an existing one
3. **Copy the API Key:**
   - Make sure your app has the necessary permissions for Stores API

## Step 4: Set Environment Variables

### Option A: Use the Setup Script (Recommended)

Run the interactive setup script:

```bash
npm run setup-wix
```

This will guide you through creating the `.env.local` file with your API credentials.

### Option B: Manual Setup

Create a `.env.local` file in your project root:

```env
# Wix API Credentials
WIX_CLIENT_ID=8a36ba43-6e83-4992-bc2c-8ebd8726f85b
WIX_SITE_ID=e3587e8a-ac64-44d8-952f-14001d3dd2f6
WIX_API_KEY=your_wix_api_key_here
```

**Important:** Replace `your_wix_api_key_here` with your actual API key from the Wix Developer Center.

## Step 5: Install Dependencies

The Wix SDK is already installed. If you need to reinstall:

```bash
npm install @wix/sdk @wix/stores
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your products page
3. You should see your live products from Wix

## Troubleshooting

### "Wix credentials not configured" Error
- Make sure your `.env.local` file exists
- Verify `WIX_CLIENT_ID`, `WIX_SITE_ID`, and `WIX_API_KEY` are set correctly
- Restart your development server after adding environment variables

### "Failed to fetch product data from Wix" Error
- Check your app permissions in Wix Developer Center
- Verify your Wix store has products
- Check the browser console for detailed error messages

### No Products Showing
- Ensure your products are published and visible in your Wix store
- Check that your app has the correct permissions
- Verify your store is active and not in maintenance mode

## API Features

This integration supports:
- ✅ Live product data from Wix
- ✅ Product collections/categories
- ✅ Product variants and options
- ✅ Product images and descriptions
- ✅ Stock status and pricing
- ✅ Search and filtering
- ✅ Shopping cart functionality
- ✅ Checkout process

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your `WIX_CLIENT_ID` and `WIX_API_KEY` secure
- Use environment variables for all sensitive data
- Consider using different app credentials for development and production

## File Structure

The following files have been created/updated for Wix integration:

- `src/lib/wix-api.ts` - Main Wix API client
- `src/lib/wix-client.ts` - Wix SDK client with authentication
- `src/app/api/products/route.ts` - API route for fetching products
- `src/components/ProductStorefront.tsx` - Updated to use new Wix API
- `env-template.txt` - Environment variables template
- `WIX_SETUP.md` - This setup guide
