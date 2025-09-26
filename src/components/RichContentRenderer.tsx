'use client';

import React, { Suspense, lazy, useState, useEffect, useMemo } from 'react';
import '@/styles/ricos.css';

// Lazy load the Ricos viewer with better chunking
const RicosViewer = lazy(() => 
  import('@wix/ricos').then(module => ({
    default: module.RicosViewer
  }))
);

// Optimized plugin loading with caching
let pluginsCache: unknown = null;
let pluginsPromise: Promise<unknown> | null = null;

const loadPlugins = (): Promise<unknown> => {
  if (pluginsCache) {
    return Promise.resolve(pluginsCache);
  }
  
  if (pluginsPromise) {
    return pluginsPromise;
  }
  
  pluginsPromise = import('@wix/ricos')
    .then(module => {
      const plugins = module.quickStartViewerPlugins();
      pluginsCache = plugins;
      return plugins;
    })
    .catch(error => {
      console.warn('Failed to load Ricos plugins:', error);
      pluginsCache = [];
      return [];
    });
    
  return pluginsPromise;
};

interface RichContentRendererProps {
  content: unknown; // Using unknown to avoid type conflicts with Wix Ricos library
}

// Optimized fallback content component
const FallbackContent: React.FC = () => (
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

const RichContentRenderer: React.FC<RichContentRendererProps> = ({ content }) => {
  const [isClient, setIsClient] = useState(false);
  const [shouldLoadRicos, setShouldLoadRicos] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Delay loading Ricos to improve initial render
    const timer = setTimeout(() => {
      setShouldLoadRicos(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Memoize content validation
  const hasValidContent = useMemo(() => {
    return content && (content as { nodes?: unknown }).nodes;
  }, [content]);

  if (!hasValidContent) {
    return <div className="text-slate-500 dark:text-slate-400">No content available</div>;
  }

  // Show fallback content immediately on server-side or before Ricos loads
  if (!isClient || !shouldLoadRicos) {
    return (
      <div className="rich-content prose prose-slate dark:prose-invert max-w-none">
        <FallbackContent />
      </div>
    );
  }

  return (
    <div className="rich-content prose prose-slate dark:prose-invert max-w-none">
      <Suspense fallback={<FallbackContent />}>
        <RicosViewerWrapper content={content} />
      </Suspense>
    </div>
  );
};

// Optimized wrapper with better error handling and faster fallback
const RicosViewerWrapper: React.FC<{ content: unknown }> = ({ content }) => {
  const [plugins, setPlugins] = React.useState<unknown>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    
    // Reduced timeout for faster fallback
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        setError('Loading timeout - showing fallback content');
        setLoading(false);
      }
    }, 3000); // Reduced from 5s to 3s

    loadPlugins()
      .then(loadedPlugins => {
        if (isMounted) {
          clearTimeout(timeoutId);
          setPlugins(loadedPlugins);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          clearTimeout(timeoutId);
          console.error('Failed to load Ricos plugins:', err);
          setError('Failed to load content renderer');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [loading]);

  // Memoize fallback content rendering
  const fallbackContent = React.useMemo(() => {
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
  }, [content]);

  if (loading) {
    return <FallbackContent />;
  }

  if (error || !plugins) {
    return fallbackContent;
  }

  return <RicosViewer content={content as never} plugins={plugins as never} />;
};

export default RichContentRenderer;
