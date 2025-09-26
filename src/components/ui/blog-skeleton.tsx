import React from 'react';

export function BlogPostSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-slate-900">
      {/* Navigation Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="animate-pulse flex items-center justify-between">
            <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Back Button Skeleton */}
        <div className="mb-8">
          <div className="animate-pulse h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="animate-pulse h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>

            <div className="animate-pulse mb-8">
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="animate-pulse h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="animate-pulse h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <div className="animate-pulse h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="animate-pulse h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="animate-pulse h-6 w-14 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </header>

          {/* Hero Image Skeleton */}
          <div className="relative h-64 md:h-96 mb-12 rounded-xl overflow-hidden shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 animate-pulse flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-amber-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-2xl font-bold">💎</span>
                </div>
                <p className="text-amber-700 dark:text-amber-300 font-medium">Loading image...</p>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 md:p-12 shadow-lg">
            <div className="space-y-6">
              <div className="animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-6"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-6"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
              </div>
            </div>
          </div>

          {/* Footer Skeleton */}
          <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="animate-pulse">
                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
              <div className="animate-pulse h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </footer>
        </article>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-6 w-48 bg-slate-700 rounded mb-4"></div>
            <div className="h-4 w-32 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-lg mb-4"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
    </div>
  );
}
