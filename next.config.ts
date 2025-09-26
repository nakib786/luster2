import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.wix.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.wixmp.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, webpack }) => {
    // Suppress warnings for deprecated React APIs used by Wix Ricos
    config.ignoreWarnings = [
      {
        module: /node_modules\/@wix\/design-system/,
        message: /findDOMNode/,
      },
      {
        module: /node_modules\/react-flip-move/,
        message: /findDOMNode/,
      },
      {
        module: /node_modules\/@wix\/ricos/,
        message: /findDOMNode/,
      },
      // Suppress all warnings from Wix packages
      {
        module: /node_modules\/@wix/,
      },
    ];

    // Add fallbacks for Node.js modules that might be missing in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      };
    }

    // Add plugins to suppress specific warnings
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );

    // Suppress console warnings during build
    if (!isServer) {
      const originalConsoleWarn = console.warn;
      console.warn = (...args) => {
        const message = args[0];
        if (
          typeof message === 'string' &&
          (message.includes('findDOMNode') || 
           message.includes('@wix/design-system') ||
           message.includes('@wix/ricos') ||
           message.includes('react-flip-move'))
        ) {
          return; // Suppress these specific warnings
        }
        originalConsoleWarn.apply(console, args);
      };
    }

    return config;
  },
  // Suppress specific warnings during build
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Reduce build warnings
  experimental: {
    // Suppress build warnings for external dependencies
    externalDir: true,
  },
};

export default nextConfig;
