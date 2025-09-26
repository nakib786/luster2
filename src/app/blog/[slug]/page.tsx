import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Lazy load heavy components
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

const OptimizedBlogPost = dynamic(() => import('@/components/OptimizedBlogPost'), {
  loading: () => (
    <div className="container mx-auto px-4 pt-8 pb-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        </div>
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
  
  // For SEO, we still generate metadata but delegate content loading to client
  const post = await getBlogPost(slug);
  
  // Generate structured data for SEO (only if post exists)
  const structuredData = post ? {
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
  } : null;

  return (
    <>
      {/* Structured Data for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-slate-900">
        <Navigation />
        <div className="pt-24">
          <OptimizedBlogPost slug={slug} />
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
