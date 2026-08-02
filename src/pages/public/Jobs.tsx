import { useEffect, useState } from 'react';
import { CareersHero } from './jobs/CareersHero';
import { WhyBuildWithTerqivo } from './jobs/WhyBuildWithTerqivo';
import { CulturePrinciples } from './jobs/CulturePrinciples';
import { OpenPositions } from './jobs/OpenPositions';
import { HiringProcess } from './jobs/HiringProcess';
import { GeneralInterest } from './jobs/GeneralInterest';
import { CareersFAQ } from './jobs/CareersFAQ';
import { CareersCTA } from './jobs/CareersCTA';
import type { Job } from './jobs/OpenPositions';

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const res = await fetch('/api/jobs');
        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await res.json();
        setJobs((data.data || []).filter((j: any) => j.status === 'open'));
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <CareersHero />
      <WhyBuildWithTerqivo />
      <CulturePrinciples />
      <OpenPositions jobs={jobs} isLoading={isLoading} hasError={hasError} />
      <HiringProcess />
      <GeneralInterest />
      <CareersFAQ />
      <CareersCTA />
    </div>
  );
}
