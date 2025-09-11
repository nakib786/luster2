'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { 
  fetchAllTikTokVideos, 
  cacheVideos, 
  getCachedVideos, 
  type TikTokVideo 
} from '@/lib/tiktokClient';

const TIKTOK_PROFILE = {
  username: 'lusterandcompany',
  displayName: '@lusterandcompany',
  profileUrl: 'https://www.tiktok.com/@lusterandcompany',
};

export default function SocialMediaSection() {
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load TikTok videos on component mount
  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First, try to get cached videos
        const cachedVideos = getCachedVideos();
        if (cachedVideos && cachedVideos.length > 0) {
          console.log('📱 Using cached TikTok videos');
          setVideos(cachedVideos);
          setLoading(false);
          
          // Still fetch fresh videos in the background
          fetchFreshVideos();
          return;
        }
        
        // If no cache, fetch fresh videos
        await fetchFreshVideos();
      } catch (error) {
        console.error('Error loading videos:', error);
        setError('Unable to load TikTok videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchFreshVideos = async () => {
      try {
        console.log('🔄 Fetching fresh TikTok videos...');
        const freshVideos = await fetchAllTikTokVideos();
        
        if (freshVideos.length === 0) {
          setError('No TikTok videos found from your profile. Make sure your TikTok profile is public and has videos.');
        } else {
          setVideos(freshVideos);
          cacheVideos(freshVideos);
          console.log(`✅ Loaded ${freshVideos.length} fresh TikTok videos`);
        }
      } catch (error) {
        console.error('Error fetching fresh videos:', error);
        setError('Failed to fetch latest TikTok videos.');
      }
    };

    loadVideos();
  }, []);

  const handleVideoClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Manually refreshing TikTok videos...');
      const freshVideos = await fetchAllTikTokVideos();
      
      if (freshVideos.length === 0) {
        setError('No TikTok videos found from your profile. Make sure your TikTok profile is public and has videos.');
      } else {
        setVideos(freshVideos);
        cacheVideos(freshVideos);
        console.log(`✅ Refreshed with ${freshVideos.length} TikTok videos`);
      }
    } catch (error) {
      console.error('Error refreshing videos:', error);
      setError('Failed to refresh TikTok videos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Follow Our TikTok Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay connected with <strong>{TIKTOK_PROFILE.displayName}</strong> on TikTok and see our latest content, 
            behind-the-scenes moments, and product showcases.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            <span className="ml-3 text-gray-600">Loading TikTok videos...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Videos Grid */}
        {!loading && !error && videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  {/* Video Embed Container */}
                  <div 
                    className="aspect-[9/16] bg-gray-100 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: video.embedCode }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => handleVideoClick(video.url)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on TikTok
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    by {video.author_name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                      <Video className="w-3 h-3 mr-1" />
                      TikTok
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVideoClick(video.url)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Videos State */}
        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
              <Video className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                No Videos Found
              </h3>
              <p className="text-yellow-700 mb-4">
                We couldn&apos;t find any videos from your TikTok profile. Make sure:
              </p>
              <ul className="text-sm text-yellow-700 text-left space-y-1 mb-4">
                <li>• Your TikTok profile is public</li>
                <li>• You have posted videos</li>
                <li>• Your username is correct</li>
              </ul>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {!loading && videos.length > 0 && (
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Follow {TIKTOK_PROFILE.displayName} on TikTok
              </h3>
              <p className="text-gray-600 mb-6">
                Don&apos;t miss out on our latest videos, product showcases, and behind-the-scenes content.
              </p>
              <Button
                className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white"
                onClick={() => window.open(TIKTOK_PROFILE.profileUrl, '_blank')}
              >
                <Video className="w-5 h-5 mr-2" />
                Follow {TIKTOK_PROFILE.displayName}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
