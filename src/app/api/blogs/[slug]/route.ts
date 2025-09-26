import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Use the same configuration as the products API
    const siteId = 'e3587e8a-ac64-44d8-952f-14001d3dd2f6';
    const accessToken = process.env.WIX_ACCESS_TOKEN;

    if (!accessToken) {
      console.error('Wix access token not configured');
      return NextResponse.json({ success: false, error: 'Wix access token not configured' }, { status: 500 });
    }

    // Fetch the specific blog post by slug using the correct REST API endpoint
    const response = await fetch(`https://www.wixapis.com/blog/v3/posts/slugs/${slug}?fieldsets[]=CONTENT_TEXT&fieldsets[]=RICH_CONTENT&fieldsets[]=URL`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'wix-site-id': siteId,
        'Content-Type': 'application/json'
      },
      // Add aggressive caching to reduce API calls
      next: { revalidate: 7200 } // Cache for 2 hours
    });

    if (!response.ok) {
      throw new Error(`Blog API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const post = data.post;
    
    if (!post) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }

    // Use the contentText field directly since it contains the blog content
    const content = post.contentText || post.excerpt || 'No content available.';

    // Transform the post to match our expected format
    const transformedPost = {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || post.contentText?.substring(0, 200) + '...' || '',
      firstPublishedDate: post.firstPublishedDate,
      lastPublishedDate: post.lastPublishedDate,
      slug: post.slug,
      featured: post.featured || false,
      pinned: post.pinned || false,
      minutesToRead: post.minutesToRead || 5,
      content: content, // Add the actual content
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
    };

    return NextResponse.json({ success: true, post: transformedPost }, {
      headers: {
        'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'max-age=7200',
        'Vercel-CDN-Cache-Control': 'max-age=7200'
      }
    });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blog post' }, { status: 500 });
  }
}