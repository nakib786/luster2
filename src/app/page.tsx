import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import CollectionsSection from '@/components/CollectionsSection';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import SocialMediaSection from '@/components/SocialMediaSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <CollectionsSection />
      <WhyChooseUsSection />
      <SocialMediaSection />
      <Footer />
    </div>
  );
}
