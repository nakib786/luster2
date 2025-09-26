import BlogSection from '@/components/BlogSection';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jewelry Blog | Expert Guides, Tips & Latest Trends | Luster Jewelry',
  description: 'Discover expert insights on jewelry, diamonds, and sustainable luxury. Read our comprehensive guides on choosing the perfect diamond, jewelry care tips, and the latest trends in ethical jewelry.',
  keywords: [
    'jewelry blog',
    'diamond guide',
    'jewelry tips',
    'sustainable jewelry',
    'luxury jewelry',
    'engagement rings',
    'jewelry care',
    'ethical jewelry',
    'diamond buying guide',
    'jewelry trends'
  ].join(', '),
  authors: [{ name: 'Luster Jewelry' }],
  creator: 'Luster Jewelry',
  publisher: 'Luster Jewelry',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://luster-jewelry.com'),
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Jewelry Blog | Expert Guides, Tips & Latest Trends | Luster Jewelry',
    description: 'Discover expert insights on jewelry, diamonds, and sustainable luxury. Read our comprehensive guides on choosing the perfect diamond, jewelry care tips, and the latest trends in ethical jewelry.',
    url: '/blog',
    siteName: 'Luster Jewelry',
    images: [
      {
        url: '/images/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Luster Jewelry Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jewelry Blog | Expert Guides, Tips & Latest Trends | Luster Jewelry',
    description: 'Discover expert insights on jewelry, diamonds, and sustainable luxury. Read our comprehensive guides on choosing the perfect diamond, jewelry care tips, and the latest trends in ethical jewelry.',
    images: ['/images/logo.svg'],
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

export default function BlogPage() {
  // Generate structured data for the blog listing page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Luster Jewelry Blog',
    description: 'Expert insights on jewelry, diamonds, and sustainable luxury',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://luster-jewelry.com'}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Luster Jewelry',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://luster-jewelry.com'}/images/logo.svg`,
      },
    },
    inLanguage: 'en-US',
    about: {
      '@type': 'Thing',
      name: 'Jewelry and Diamonds',
    },
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
      
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24">
          <BlogSection />
        </div>
        <Footer />
      </div>
    </>
  );
}
