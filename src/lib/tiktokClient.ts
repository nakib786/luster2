/**
 * Client-side TikTok Video Fetcher
 * 
 * This module fetches TikTok videos directly in the browser for each client.
 * It uses TikTok's oEmbed API and profile scraping to get the latest videos.
 */

export interface TikTokVideo {
  id: string;
  url: string;
  embedCode: string;
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
}

import { KNOWN_TIKTOK_VIDEOS } from '@/config/knownVideos';

const TIKTOK_USERNAME = 'lusterandcompany';
const PROFILE_URL = `https://www.tiktok.com/@${TIKTOK_USERNAME}`;

/**
 * Fetch TikTok embed data using oEmbed API with CORS proxy
 */
export async function fetchTikTokEmbed(videoUrl: string): Promise<TikTokVideo | null> {
  try {
    // Use CORS proxy to bypass browser restrictions
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(oembedUrl)}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch embed data');
    }
    
    const proxyData = await response.json();
    const data = JSON.parse(proxyData.contents);
    
    return {
      id: videoUrl.split('/').pop() || Date.now().toString(),
      url: videoUrl,
      embedCode: data.html,
      title: data.title,
      author_name: data.author_name,
      author_url: data.author_url,
      thumbnail_url: data.thumbnail_url,
      thumbnail_width: data.thumbnail_width,
      thumbnail_height: data.thumbnail_height,
    };
  } catch (error) {
    console.error('Error fetching TikTok embed:', error);
    return null;
  }
}

/**
 * Extract video URLs from TikTok profile page HTML
 */
function extractVideoUrlsFromHTML(html: string): string[] {
  const videoUrls: string[] = [];
  
  // Multiple regex patterns to catch different URL formats
  const patterns = [
    /https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+/g,
    /"videoId":"(\d+)"/g,
    /\/video\/(\d+)/g,
  ];
  
  patterns.forEach((pattern, index) => {
    const matches = html.match(pattern);
    if (matches) {
      matches.forEach(match => {
        let videoUrl: string | undefined;
        
        if (index === 0) {
          // Full URL pattern
          videoUrl = match;
        } else {
          // Extract video ID and construct URL
          const videoId = match.match(/\d+/)?.[0];
          if (videoId) {
            videoUrl = `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${videoId}`;
          }
        }
        
        if (videoUrl && !videoUrls.includes(videoUrl)) {
          videoUrls.push(videoUrl);
        }
      });
    }
  });
  
  // Remove duplicates and limit to latest videos
  return [...new Set(videoUrls)].slice(0, 12);
}

/**
 * Fetch TikTok profile page and extract video URLs
 * Note: This uses a CORS proxy to bypass browser restrictions
 */
export async function fetchTikTokProfileVideos(): Promise<string[]> {
  try {
    console.log(`🔍 Fetching TikTok profile videos for @${TIKTOK_USERNAME}...`);
    
    // Use a CORS proxy to fetch the TikTok profile page
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(PROFILE_URL)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile page');
    }
    
    const data = await response.json();
    const html = data.contents;
    
    const videoUrls = extractVideoUrlsFromHTML(html);
    console.log(`✅ Found ${videoUrls.length} video URLs`);
    
    return videoUrls;
  } catch (error) {
    console.error('Error fetching TikTok profile:', error);
    return [];
  }
}

/**
 * Alternative method: Use TikTok's profile oEmbed API with CORS proxy
 */
export async function fetchTikTokProfileEmbed(): Promise<string[]> {
  try {
    console.log(`🔍 Fetching TikTok profile embed for @${TIKTOK_USERNAME}...`);
    
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(PROFILE_URL)}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(oembedUrl)}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile embed');
    }
    
    const proxyData = await response.json();
    const data = JSON.parse(proxyData.contents);
    const videoUrls = extractVideoUrlsFromHTML(data.html);
    
    console.log(`✅ Found ${videoUrls.length} video URLs from profile embed`);
    return videoUrls;
  } catch (error) {
    console.error('Error fetching TikTok profile embed:', error);
    return [];
  }
}


/**
 * Fetch all TikTok videos for the profile
 * This is the main function that tries multiple methods
 */
export async function fetchAllTikTokVideos(): Promise<TikTokVideo[]> {
  try {
    console.log('🚀 Starting TikTok video fetch process...');
    
    let videoUrls: string[] = [];
    
    // Try profile embed first (more reliable)
    try {
      videoUrls = await fetchTikTokProfileEmbed();
    } catch {
      console.log('Profile embed failed, trying profile scraping...');
      videoUrls = await fetchTikTokProfileVideos();
    }
    
    if (videoUrls.length === 0) {
      console.log('⚠️ No videos found from TikTok profile, using known video URLs');
      // Use the known video URLs from configuration
      videoUrls = KNOWN_TIKTOK_VIDEOS;
    }
    
    console.log(`📊 Processing ${videoUrls.length} video URLs...`);
    
    // Fetch embed data for each video with rate limiting
    const successfulVideos: TikTokVideo[] = [];
    
    for (let i = 0; i < videoUrls.length; i++) {
      const url = videoUrls[i];
      try {
        const embedData = await fetchTikTokEmbed(url);
        if (embedData) {
          successfulVideos.push(embedData);
        }
        
        // Add delay between requests to avoid rate limiting
        if (i < videoUrls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Error fetching video ${url}:`, error);
        // Skip this video if it fails - no fallback
      }
    }
    
    console.log(`✅ Successfully loaded ${successfulVideos.length} videos`);
    return successfulVideos;
    
  } catch (error) {
    console.error('❌ Error fetching TikTok videos:', error);
    return [];
  }
}

/**
 * Cache videos in localStorage to avoid repeated API calls
 */
export function cacheVideos(videos: TikTokVideo[]): void {
  try {
    const cacheData = {
      videos,
      timestamp: Date.now(),
      expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes
    };
    localStorage.setItem('tiktok-videos-cache', JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching videos:', error);
  }
}

/**
 * Get cached videos if they're still valid
 */
export function getCachedVideos(): TikTokVideo[] | null {
  try {
    const cached = localStorage.getItem('tiktok-videos-cache');
    if (!cached) return null;
    
    const cacheData = JSON.parse(cached);
    
    if (Date.now() > cacheData.expiresAt) {
      localStorage.removeItem('tiktok-videos-cache');
      return null;
    }
    
    return cacheData.videos;
  } catch (error) {
    console.error('Error reading cached videos:', error);
    return null;
  }
}
