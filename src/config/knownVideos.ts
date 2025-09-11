/**
 * Known TikTok Video URLs
 * 
 * Add your actual TikTok video URLs here as a fallback when profile scraping fails.
 * This ensures your website always has real videos to display.
 */

export const KNOWN_TIKTOK_VIDEOS = [
  'https://www.tiktok.com/@lusterandcompany/video/7547857913516215572',
  // Add more video URLs here as you create new content
  // 'https://www.tiktok.com/@lusterandcompany/video/ANOTHER_VIDEO_ID',
  // 'https://www.tiktok.com/@lusterandcompany/video/ANOTHER_VIDEO_ID',
];

/**
 * Instructions for adding new videos:
 * 1. Go to your TikTok video on tiktok.com
 * 2. Copy the full URL from the browser address bar
 * 3. Add it to the KNOWN_TIKTOK_VIDEOS array above
 * 4. Save this file
 * 
 * The system will automatically use these videos if profile scraping fails.
 */
