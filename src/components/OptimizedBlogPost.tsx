'use client';

import { useState, useEffect, Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const RichContentRenderer = dynamic(() => import('@/components/RichContentRenderer'), {
  loading: () => (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
      </div>
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>
    </div>
  )
});

interface RichContentNode {
  type: string;
  id: string;
  nodes?: RichContentNode[];
  textData?: {
    text: string;
    decorations: Array<{
      type: string;
      fontWeightValue?: number;
    }>;
  };
  headingData?: {
    level: number;
    textStyle?: {
      textAlignment?: string;
    };
  };
  paragraphData?: Record<string, unknown>;
  imageData?: {
    containerData?: {
      width?: { size: string };
      alignment?: string;
      textWrap?: boolean;
    };
    image?: {
      src?: { id: string };
      width?: number;
      height?: number;
    };
    altText?: string;
    caption?: string;
  };
  bulletedListData?: {
    indentation: number;
  };
  orderedListData?: {
    indentation: number;
  };
}

interface RichContent {
  nodes: RichContentNode[];
  documentStyle?: Record<string, unknown>;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  firstPublishedDate: string;
  lastPublishedDate: string;
  slug: string;
  featured: boolean;
  pinned: boolean;
  minutesToRead: number;
  contentText?: string;
  richContent?: RichContent;
  media?: {
    wixMedia?: {
      image?: {
        id: string;
        url: string;
        height: number;
        width: number;
        filename: string;
      };
    };
    displayed: boolean;
    custom: boolean;
  };
  memberId: string;
  hashtags: string[];
  categoryIds: string[];
}

interface OptimizedBlogPostProps {
  slug: string;
}

export default function OptimizedBlogPost({ slug }: OptimizedBlogPostProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        
        // Add timeout and better error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
        
        const response = await fetch(`/api/blogs/${slug}`, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=3600, stale-while-revalidate=86400'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog post: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.post) {
          setPost(data.post);
        } else {
          throw new Error('Blog post not found');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timeout - please try again');
        } else {
          setError('Failed to load blog post');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-8 pb-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <header className="mb-12 animate-pulse">
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            </div>

            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-8"></div>

            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              ))}
            </div>
          </header>

          {/* Hero Image Skeleton */}
          <div className="relative h-64 md:h-96 mb-12 rounded-xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 animate-pulse flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-amber-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-2xl font-bold">💎</span>
                </div>
                <p className="text-amber-700 dark:text-amber-300 font-medium">Loading blog post...</p>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 md:p-12 shadow-lg">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-8 pb-8">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Error Loading Blog Post</h1>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 pt-8 pb-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.featured && (
              <Badge className="bg-amber-500 text-white">Featured</Badge>
            )}
            {post.pinned && (
              <Badge className="bg-blue-500 text-white">Pinned</Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(post.firstPublishedDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.minutesToRead} min read</span>
            </div>
          </div>

          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.hashtags.map((hashtag, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  #{hashtag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Hero Image */}
        {post.media?.displayed && post.media?.wixMedia?.image && (
          <div className="relative h-64 md:h-96 mb-12 rounded-xl overflow-hidden shadow-2xl">
            <Suspense fallback={
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 animate-pulse flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-amber-500 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-white text-2xl font-bold">💎</span>
                  </div>
                  <p className="text-amber-700 dark:text-amber-300 font-medium">Loading image...</p>
                </div>
              </div>
            }>
              <Image
                src={post.media.wixMedia.image.url}
                alt={post.title}
                fill
                className="object-cover transition-opacity duration-300"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </Suspense>
          </div>
        )}

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 md:p-12 shadow-lg">
          <Suspense fallback={
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
              </div>
            </div>
          }>
            {post.richContent ? (
              <RichContentRenderer content={post.richContent} />
            ) : post.contentText ? (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {post.contentText.split('\n\n').map((paragraph, index) => {
                  // Check if paragraph looks like a heading (short and no period)
                  const isHeading = paragraph.length < 100 && !paragraph.includes('.') && paragraph.length > 0;
                  
                  if (isHeading) {
                    return (
                      <h2 key={index} className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4 first:mt-0">
                        {paragraph}
                      </h2>
                    );
                  } else if (paragraph.trim()) {
                    return (
                      <p key={index} className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No content available.</p>
            )}
          </Suspense>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="text-slate-600 dark:text-slate-400">
              <p className="text-sm">Published on {formatDate(post.firstPublishedDate)}</p>
              {post.lastPublishedDate !== post.firstPublishedDate && (
                <p className="text-sm">Last updated on {formatDate(post.lastPublishedDate)}</p>
              )}
            </div>
            
            <Link href="/blog">
              <Button variant="outline" className="hover:bg-amber-50 dark:hover:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 transition-colors">
                View All Posts
              </Button>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
