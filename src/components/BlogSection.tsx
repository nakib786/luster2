'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  contentText?: string;
  richContent?: {
    nodes: Record<string, unknown>[];
    documentStyle?: Record<string, unknown>;
  };
  firstPublishedDate: string;
  lastPublishedDate: string;
  slug: string;
  featured: boolean;
  pinned: boolean;
  minutesToRead: number;
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

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data: BlogResponse = await response.json();
        
        if (data.success) {
          setBlogs(data.posts);
        } else {
          setError('Failed to fetch blogs');
        }
      } catch (err) {
        setError('Error loading blogs');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Latest Blog Posts
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Discover insights, trends, and stories from our jewelry experts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-slate-600 dark:text-slate-300">No blog posts available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Discover insights, trends, and stories from our jewelry experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="p-0">
                <div className="relative h-48 overflow-hidden rounded-t-lg bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800">
                  {post.media?.wixMedia?.image ? (
                    <Image
                      src={post.media.wixMedia.image.url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 bg-amber-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">💎</span>
                        </div>
                        <p className="text-amber-700 dark:text-amber-300 font-medium">Diamond Blog</p>
                      </div>
                    </div>
                  )}
                  {post.featured && (
                    <Badge className="absolute top-4 left-4 bg-amber-500 text-white">
                      Featured
                    </Badge>
                  )}
                  {post.pinned && (
                    <Badge className="absolute top-4 right-4 bg-blue-500 text-white">
                      Pinned
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.firstPublishedDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.minutesToRead} min read</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {post.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.slice(0, 3).map((hashtag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{hashtag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Link href={`/blog/${post.slug}`}>
                  <Button className="w-full group-hover:bg-amber-600 dark:group-hover:bg-amber-500 transition-colors">
                    Read More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {blogs.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" size="lg" className="hover:bg-amber-50 dark:hover:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300">
                View All Posts
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
