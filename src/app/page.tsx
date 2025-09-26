import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import dynamic from 'next/dynamic';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import ReviewsSection from '@/components/ReviewsSection';
import BlogSection from '@/components/BlogSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

// Dynamically import CollectionsSection to prevent hydration issues
const CollectionsSection = dynamic(() => import('@/components/CollectionsSection'), {
  loading: () => (
    <section id="collections" className="py-32 bg-gradient-to-br from-gray-50 via-white to-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luster-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collections...</p>
        </div>
      </div>
    </section>
  )
});

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <CollectionsSection />
      <WhyChooseUsSection />
      <ReviewsSection />
      <BlogSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
