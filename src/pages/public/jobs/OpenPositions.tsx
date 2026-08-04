import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Building, Clock, Briefcase } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export interface Job {
  _id: string;
  title: string;
  slug: string;
  department?: string;
  location?: string;
  workMode?: string;
  employmentType?: string;
  shortDescription?: string;
  status: string;
}

function JobSkeleton() {
  return (
    <div className="bg-background rounded-2xl border p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-4 flex-1">
        <div className="w-1/2 h-8 rounded bg-muted/50 animate-pulse" />
        <div className="flex gap-4">
          <div className="w-24 h-4 rounded bg-muted/50 animate-pulse" />
          <div className="w-24 h-4 rounded bg-muted/50 animate-pulse" />
          <div className="w-24 h-4 rounded bg-muted/50 animate-pulse" />
        </div>
        <div className="w-full h-4 rounded bg-muted/50 animate-pulse" />
      </div>
      <div className="shrink-0 w-32 h-12 rounded-md bg-muted/50 animate-pulse" />
    </div>
  );
}

function JobsEmptyState() {
  return (
    <div className="w-full py-16 px-4 bg-background border rounded-2xl text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <Briefcase className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-heading font-bold mb-3">No open positions right now.</h3>
      <p className="text-muted-foreground max-w-lg mx-auto mb-8">
        Terqivo is not currently accepting applications for a published role. New opportunities will appear here as they become available.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
        <Button size="lg" asChild>
          <Link to="/contact">Share Your Profile</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/contact">Contact Terqivo</Link>
        </Button>
      </div>
    </div>
  );
}

interface OpenPositionsProps {
  jobs: Job[];
  isLoading: boolean;
  hasError: boolean;
}

export function OpenPositions({ jobs, isLoading, hasError }: OpenPositionsProps) {
  return (
    <section id="open-positions" className="py-24 bg-muted/10 border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Open positions</h2>
          <p className="text-lg text-muted-foreground">
            Current opportunities at Terqivo will appear here when applications are open.
          </p>
        </div>

        {isLoading ? (
          <div className="grid xl:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <JobSkeleton key={i} />
            ))}
          </div>
        ) : hasError || jobs.length === 0 ? (
          <JobsEmptyState />
        ) : (
          <div className="grid xl:grid-cols-2 gap-6">
            {jobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-background p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-accent/40 hover:shadow-md transition-all group"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-heading font-bold group-hover:text-accent transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
                    {job.department && (
                      <span className="flex items-center gap-1.5 bg-muted/30 px-2.5 py-1 rounded-md border">
                        <Building className="h-4 w-4" /> {job.department}
                      </span>
                    )}
                    {(job.location || job.workMode) && (
                      <span className="flex items-center gap-1.5 bg-muted/30 px-2.5 py-1 rounded-md border">
                            <MapPin className="h-4 w-4" /> {job.workMode ? `${job.location ? job.location + ' • ' : ''}${job.workMode}` : job.location}
                      </span>
                    )}
                    {job.employmentType && (
                      <span className="flex items-center gap-1.5 bg-muted/30 px-2.5 py-1 rounded-md border">
                        <Clock className="h-4 w-4" /> {job.employmentType}
                      </span>
                    )}
                  </div>
                  {job.shortDescription && (
                    <p className="text-muted-foreground leading-relaxed max-w-2xl line-clamp-2">
                      {job.shortDescription}
                    </p>
                  )}
                </div>
                
                <div className="shrink-0 mt-2 md:mt-0">
                  <Button size="lg" className="w-full md:w-auto" asChild>
                    <Link to={`/jobs/${job.slug}`}>
                      View Position <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
