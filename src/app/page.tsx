import Features from '@/components/landing/features-1';
import Footer from '@/components/landing/footer';
import HeroSection from '@/components/landing/hero-section';
import Integrations from '@/components/landing/integrations-6';
import Pricing from '@/components/landing/pricing';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div id="features">
        <Features />
      </div>
      <div id="integrations">
        <Integrations />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
}
