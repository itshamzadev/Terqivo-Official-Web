import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft, Clock, MapPin, Building, CheckCircle2, MessageCircle } from 'lucide-react';
import { ImagePlaceholder } from '@/src/components/ui/image-placeholder';
import Markdown from 'react-markdown';
import { formatPrice, whatsappUrl } from '@/src/lib/utils';
import { useSettings } from '@/src/components/SettingsContext';

export default function JobDetails() {
  const { slug } = useParams();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    fetch(`/api/jobs/${slug}`)
      .then(res => res.json())
      .then(data => {
        setJob(data.data || null);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-heading font-bold">Job Not Found</h1>
        <Button className="mt-6" asChild><Link to="/jobs">Back to Careers</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-muted/30 pt-20 pb-16 border-b">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground" asChild>
            <Link to="/jobs"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Careers</Link>
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">{job.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
            {job.department && (
              <span className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-accent" /> {job.department}
              </span>
            )}
            {job.location && (
              <span className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-accent" /> {job.location}
              </span>
            )}
            {job.workType && (
              <span className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-accent" /> {job.workType}
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ml-auto ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {job.status === 'open' ? 'Accepting Applications' : 'Position Closed'}
            </span>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">About the Role</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <Markdown>{job.description || 'No detailed description available.'}</Markdown>
                </div>
              </div>
              
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-6">Key Responsibilities</h2>
                  <ul className="space-y-4">
                    {job.responsibilities.map((req: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mr-4 mt-0.5 text-xs font-bold">{i+1}</div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-6">Requirements</h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-accent mr-3 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-background border border-border rounded-[24px] p-6 sticky top-24 shadow-sm">
                <ImagePlaceholder title="Office Preview" className="w-full aspect-[4/3] rounded-xl mb-6" />
                <h3 className="text-xl font-heading font-bold mb-2">Ready to join us?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Help us build the future of technology infrastructure.
                </p>
                {job.applicationFeeEnabled && (
                  <p className="text-sm font-medium mb-4">Application fee: {formatPrice(job.applicationFeeAmount, job.applicationFeeCurrency)}</p>
                )}
                <Button className="w-full h-12 text-lg" disabled={job.status !== 'open'} asChild={job.status === 'open'}>
                  {job.status === 'open' ? (
                    <Link to={`/jobs/${job.slug}/apply`}>Apply Now</Link>
                  ) : (
                    <span>Position Filled</span>
                  )}
                </Button>
                {((job.allowWhatsAppApplication && job.applicationWhatsAppNumber) || (settings.jobContact?.jobWhatsAppEnabled && settings.jobContact?.jobWhatsAppNumber)) && whatsappUrl(job.applicationWhatsAppNumber || settings.jobContact?.jobWhatsAppNumber, (job.applicationWhatsAppMessage || settings.jobContact?.jobWhatsAppMessage || 'Hello Terqivo, I want to discuss the {jobTitle} opportunity.').replace('{jobTitle}', job.title)) && (
                  <Button variant="outline" className="w-full mt-3" asChild>
                    <a href={whatsappUrl(job.applicationWhatsAppNumber || settings.jobContact?.jobWhatsAppNumber, (job.applicationWhatsAppMessage || settings.jobContact?.jobWhatsAppMessage || '').replace('{jobTitle}', job.title))} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
