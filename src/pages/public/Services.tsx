import { SolutionsHero } from './services/SolutionsHero';
import { CategoryOverview } from './services/CategoryOverview';
import { DynamicSolutionsGrid } from './services/DynamicSolutionsGrid';
import { SolutionApproach } from './services/SolutionApproach';
import { EngineeringCapabilities } from './services/EngineeringCapabilities';
import { SecurityScalability } from './services/SecurityScalability';
import { EngagementModel } from './services/EngagementModel';
import { SolutionsCTA } from './services/SolutionsCTA';

export default function Services() {
  return (
    <div className="flex flex-col w-full">
      <SolutionsHero />
      <CategoryOverview />
      <DynamicSolutionsGrid />
      <SolutionApproach />
      <EngineeringCapabilities />
      <SecurityScalability />
      <EngagementModel />
      <SolutionsCTA />
    </div>
  );
}
