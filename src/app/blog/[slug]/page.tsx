import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Optimized dynamic imports with better loading states
const RichContentRenderer = dynamic(() => import('@/components/RichContentRenderer'), {
  loading: () => (
    <div className="space-y-4">
      <div className="animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>
    </div>
  )
});

// Lazy load Navigation and Footer with better performance
const Navigation = dynamic(() => import('@/components/Navigation'), {
  loading: () => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="animate-pulse flex items-center justify-between">
          <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>
  )
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => (
    <div className="bg-slate-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-slate-700 rounded mb-4"></div>
          <div className="h-4 w-32 bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>
  )
});

import { Metadata } from 'next';

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

interface BlogResponse {
  success: boolean;
  posts: BlogPost[];
  metaData: {
    count: number;
    offset: number;
    total: number;
  };
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs/${slug}`, {
      // Use ISR caching for better performance
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Cache-Control': 'max-age=3600, stale-while-revalidate=86400'
      }
    });
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (data.success && data.post) {
      return data.post;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://luster-jewelry.com';
  const postUrl = `${baseUrl}/blog/${slug}`;
  const imageUrl = post.media?.wixMedia?.image?.url || `${baseUrl}/images/logo.svg`;

  return {
    title: `${post.title} | Luster Jewelry Blog`,
    description: post.excerpt || post.contentText?.substring(0, 160) + '...' || 'Read our latest insights on jewelry, diamonds, and sustainable luxury.',
    keywords: [
      'jewelry',
      'diamonds',
      'sustainable jewelry',
      'luxury jewelry',
      'engagement rings',
      'diamond guide',
      'jewelry care',
      'ethical jewelry',
      ...post.hashtags
    ].join(', '),
    authors: [{ name: 'Luster Jewelry' }],
    creator: 'Luster Jewelry',
    publisher: 'Luster Jewelry',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.contentText?.substring(0, 160) + '...' || 'Read our latest insights on jewelry, diamonds, and sustainable luxury.',
      url: postUrl,
      siteName: 'Luster Jewelry',
      images: [
        {
          url: imageUrl,
          width: post.media?.wixMedia?.image?.width || 1200,
          height: post.media?.wixMedia?.image?.height || 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.firstPublishedDate,
      modifiedTime: post.lastPublishedDate,
      authors: ['Luster Jewelry'],
      section: 'Jewelry',
      tags: post.hashtags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.contentText?.substring(0, 160) + '...' || 'Read our latest insights on jewelry, diamonds, and sustainable luxury.',
      images: [imageUrl],
      creator: '@lusterjewelry',
      site: '@lusterjewelry',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_ID,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.contentText?.substring(0, 160) + '...' || 'Read our latest insights on jewelry, diamonds, and sustainable luxury.',
    image: post.media?.wixMedia?.image?.url || `${process.env.NEXT_PUBLIC_BASE_URL || 'https://luster-jewelry.com'}/images/logo.svg`,
    author: {
      '@type': 'Organization',
      name: 'Luster Jewelry',
      url: process.env.NEXT_PUBLIC_BASE_URL || 'https://luster-jewelry.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Luster Jewelry',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://luster-jewelry.com'}/images/logo.svg`,
      },
    },
    datePublished: post.firstPublishedDate,
    dateModified: post.lastPublishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://luster-jewelry.com'}/blog/${slug}`,
    },
    keywords: post.hashtags.join(', '),
    articleSection: 'Jewelry',
    wordCount: post.contentText?.length || 0,
    timeRequired: `PT${post.minutesToRead}M`,
    inLanguage: 'en-US',
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-slate-900">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
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
              <div className="space-y-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-6"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
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
      <Footer />
      </div>
    </>
  );
}

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs`, {
      // Cache for 24 hours for static generation
      next: { revalidate: 86400 },
      headers: {
        'Cache-Control': 'max-age=86400, stale-while-revalidate=172800'
      }
    });
    
    if (!response.ok) {
      return [];
    }

    const data: BlogResponse = await response.json();
    
    if (data.success && data.posts) {
      return data.posts.map((post) => ({
        slug: post.slug,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
