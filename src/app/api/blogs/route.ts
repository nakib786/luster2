import { NextResponse } from 'next/server';

interface WixBlogPost {
  id: string;
  title: string;
  excerpt?: string;
  contentText?: string;
  firstPublishedDate: string;
  lastPublishedDate: string;
  slug: string;
  featured?: boolean;
  pinned?: boolean;
  minutesToRead?: number;
  richContent?: Record<string, unknown>;
  media?: Record<string, unknown>;
  memberId: string;
  hashtags?: string[];
  categoryIds?: string[];
  commentingEnabled?: boolean;
  tagIds?: string[];
  relatedPostIds?: string[];
  pricingPlanIds?: string[];
  language?: string;
  preview?: Record<string, unknown>;
  contentId?: string;
  mostRecentContributorId?: string;
  hasUnpublishedChanges?: boolean;
  translations?: Record<string, unknown>[];
  customExcerpt?: string;
  internalCategoryIds?: string[];
  internalRelatedPostIds?: string[];
}

export async function GET() {
  try {
    // Use the same configuration as the products API
    const siteId = 'e3587e8a-ac64-44d8-952f-14001d3dd2f6';
    const accessToken = process.env.WIX_ACCESS_TOKEN;

    if (!accessToken) {
      console.error('Wix access token not configured');
      return NextResponse.json({ success: false, error: 'Wix access token not configured' }, { status: 500 });
    }

    // Fetch all published blog posts from Wix using the correct REST API endpoint
    const response = await fetch(`https://www.wixapis.com/blog/v3/posts?fieldsets=CONTENT_TEXT,RICH_CONTENT,URL&paging.limit=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'wix-site-id': siteId,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Blog API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const posts: WixBlogPost[] = data.posts || [];

    // Transform the posts to match our expected format
    const transformedPosts = posts.map((post: WixBlogPost) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || post.contentText?.substring(0, 200) + '...' || '',
      firstPublishedDate: post.firstPublishedDate,
      lastPublishedDate: post.lastPublishedDate,
      slug: post.slug,
      featured: post.featured || false,
      pinned: post.pinned || false,
      minutesToRead: post.minutesToRead || 5,
      contentText: post.contentText,
      richContent: post.richContent,
      media: post.media,
      memberId: post.memberId,
      hashtags: post.hashtags || [],
      categoryIds: post.categoryIds || [],
      commentingEnabled: post.commentingEnabled,
      tagIds: post.tagIds || [],
      relatedPostIds: post.relatedPostIds || [],
      pricingPlanIds: post.pricingPlanIds || [],
      language: post.language,
      preview: post.preview,
      contentId: post.contentId,
      mostRecentContributorId: post.mostRecentContributorId,
      hasUnpublishedChanges: post.hasUnpublishedChanges,
      translations: post.translations || [],
      customExcerpt: post.customExcerpt,
      internalCategoryIds: post.internalCategoryIds || [],
      internalRelatedPostIds: post.internalRelatedPostIds || []
    }));

    return NextResponse.json({
      success: true,
      posts: transformedPosts,
      metaData: {
        total: data.metaData?.total || transformedPosts.length,
        offset: data.metaData?.offset || 0,
        count: transformedPosts.length
      }
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}