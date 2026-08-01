import { AboutHero } from './about/AboutHero';
import { OurStory } from './about/OurStory';
import { Mission } from './about/Mission';
import { Vision } from './about/Vision';
import { CoreValues } from './about/CoreValues';
import { EngineeringPhilosophy } from './about/EngineeringPhilosophy';
import { WhyTerqivo } from './about/WhyTerqivo';
import { Leadership } from './about/Leadership';
import { CompanyPrinciples } from './about/CompanyPrinciples';
import { AboutCTA } from './about/AboutCTA';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <AboutHero />
      <OurStory />
      <Mission />
      <Vision />
      <CoreValues />
      <EngineeringPhilosophy />
      <WhyTerqivo />
      <Leadership />
      <CompanyPrinciples />
      <AboutCTA />
    </div>
  );
}
