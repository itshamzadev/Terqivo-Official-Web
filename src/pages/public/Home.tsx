import { useEffect } from 'react';

// Sections
import { HeroSection } from './home/HeroSection';
import { PositioningStrip } from './home/PositioningStrip';
import { FeaturedProduct } from './home/FeaturedProduct';
import { SolutionsSection } from './home/SolutionsSection';
import { WhyTerqivo } from './home/WhyTerqivo';
import { DevelopmentProcess } from './home/DevelopmentProcess';
import { SecuritySection } from './home/SecuritySection';
import { CapabilitiesSection } from './home/CapabilitiesSection';
import { VisionSection } from './home/VisionSection';
import { FinalCTA } from './home/FinalCTA';

export default function Home() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <PositioningStrip />
      <FeaturedProduct />
      <SolutionsSection />
      <WhyTerqivo />
      <DevelopmentProcess />
      <SecuritySection />
      <CapabilitiesSection />
      <VisionSection />
      <FinalCTA />
    </div>
  );
}