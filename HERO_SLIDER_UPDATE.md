# Hero Slider Dynamic Product Images Update

## Overview
The hero slider has been updated to automatically fetch and display product images from the Wix store instead of using static placeholder images. This ensures that when new products are added to the store, they will automatically appear in the hero slider.

## Changes Made

### 1. Created Custom Hook (`src/hooks/useProductImages.ts`)
- **Purpose**: Fetches product images from the `/api/products` endpoint
- **Features**:
  - Automatically extracts all product images (main images + additional images)
  - Removes duplicate images
  - Provides loading states and error handling
  - Falls back to static images if API fails
  - Includes refetch functionality

### 2. Updated HeroSection Component (`src/components/HeroSection.tsx`)
- **Dynamic Image Loading**: Now uses `useProductImages` hook to fetch real product images
- **Loading State**: Shows a spinning loader while images are being fetched
- **Error Handling**: Displays a subtle error indicator if image fetching fails
- **Fallback Images**: Uses static Unsplash images if no product images are available
- **Better Alt Text**: Uses actual product names for better accessibility
- **Image Error Recovery**: Automatically falls back to default image if a product image fails to load

### 3. Key Features

#### Automatic Updates
- When new products are added to the Wix store, they will automatically appear in the hero slider
- No manual updates required to the codebase

#### Robust Error Handling
- API failures gracefully fall back to static images
- Individual image load failures are handled with fallback images
- Loading states provide good user experience

#### Performance Optimized
- Images are fetched once when the component mounts
- Proper image prioritization for the first image
- Efficient image rotation with proper cleanup

## How It Works

1. **Component Mount**: HeroSection component mounts and calls `useProductImages` hook
2. **API Call**: Hook makes a request to `/api/products` endpoint
3. **Image Extraction**: Hook extracts all product images from the API response
4. **State Management**: Hook manages loading, error, and image states
5. **Rendering**: Component renders images with proper loading states and error handling
6. **Rotation**: Images automatically rotate every 3 seconds

## API Integration

The implementation uses the existing `/api/products` endpoint which:
- Fetches products from Wix Stores API
- Transforms the data to include proper image URLs
- Handles both main product images and additional gallery images
- Provides proper error handling and fallbacks

## Configuration Requirements

### Next.js Image Configuration
The `next.config.ts` file has been updated to allow Wix image domains:
- `static.wixstatic.com` - Main Wix static image hosting
- `media.wix.com` - Wix media hosting
- `images.wixmp.com` - Wix image CDN

This is required for Next.js Image component to load external images from Wix.

## Testing

A test file has been created at `src/hooks/__tests__/useProductImages.test.ts` to ensure:
- Successful image fetching
- Error handling
- Refetch functionality
- Proper state management

## Benefits

1. **Automatic Updates**: New products automatically appear in the hero slider
2. **Better User Experience**: Real product images instead of generic placeholders
3. **SEO Friendly**: Proper alt text with actual product names
4. **Robust**: Handles failures gracefully with fallbacks
5. **Performance**: Optimized loading and caching

## Future Enhancements

Potential improvements that could be added:
- Image caching for better performance
- Lazy loading for images not currently visible
- Image optimization and resizing
- Analytics tracking for image interactions
- A/B testing for different image sets
