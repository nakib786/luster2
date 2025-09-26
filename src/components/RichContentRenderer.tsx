'use client';

import React, { Suspense, lazy, useState, useEffect } from 'react';
import '@/styles/ricos.css';

// Lazy load the Ricos viewer to improve initial compilation time
const RicosViewer = lazy(() => 
  import('@wix/ricos').then(module => ({
    default: module.RicosViewer
  }))
);

// Lazy load plugins with error handling
const loadPlugins = () => 
  import('@wix/ricos').then(module => module.quickStartViewerPlugins()).catch(error => {
    console.warn('Failed to load Ricos plugins:', error);
    return [];
  });

interface RichContentRendererProps {
  content: unknown; // Using unknown to avoid type conflicts with Wix Ricos library
}

const RichContentRenderer: React.FC<RichContentRendererProps> = ({ content }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!content || !(content as { nodes?: unknown }).nodes) {
    return <div className="text-slate-500 dark:text-slate-400">No content available</div>;
  }

  // Show fallback content immediately on server-side
  if (!isClient) {
    return (
      <div className="rich-content prose prose-slate dark:prose-invert max-w-none">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rich-content prose prose-slate dark:prose-invert max-w-none">
      <Suspense fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        </div>
      }>
        <RicosViewerWrapper content={content} />
      </Suspense>
    </div>
  );
};

// Separate component to handle the async plugin loading
const RicosViewerWrapper: React.FC<{ content: unknown }> = ({ content }) => {
  const [plugins, setPlugins] = React.useState<unknown>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Load plugins with timeout
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError('Loading timeout - showing fallback content');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    loadPlugins()
      .then(loadedPlugins => {
        clearTimeout(timeoutId);
        setPlugins(loadedPlugins);
        setLoading(false);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.error('Failed to load Ricos plugins:', err);
        setError('Failed to load content renderer');
        setLoading(false);
      });

    return () => clearTimeout(timeoutId);
  }, [loading]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      </div>
    );
  }

  if (error || !plugins) {
    // Fallback to simple text rendering if Ricos fails
    const contentData = content as { nodes?: Array<{ textData?: { text: string } }> };
    if (contentData?.nodes) {
      return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {contentData.nodes.map((node, index) => {
            if (node.textData?.text) {
              return (
                <p key={index} className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
                  {node.textData.text}
                </p>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return <div className="text-slate-500 dark:text-slate-400">Content temporarily unavailable</div>;
  }

  return <RicosViewer content={content as never} plugins={plugins as never} />;
};

export default RichContentRenderer;
