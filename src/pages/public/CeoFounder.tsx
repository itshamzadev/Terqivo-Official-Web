import { useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft, ArrowUpRight, Cpu, Code2, ShieldCheck, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProgressiveImage } from '@/src/components/ui/progressive-image';
import companyFounder from '@/src/assets/images/company-founder.jpeg';

export default function CeoFounder() {
  useEffect(() => {
    document.title = "Muhammad Hamza — CEO & Founder of Terqivo";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', "Learn about Muhammad Hamza, CEO and Founder of Terqivo, and his work in intelligent software, AI-powered products, and modern digital systems.");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-muted/30 pt-20 pb-16 border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground transition-colors" asChild>
            <Link to="/about"><ArrowLeft className="mr-2 h-4 w-4" /> Back to About</Link>
          </Button>
          
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden border border-border/50 shadow-sm bg-background">
                <ProgressiveImage
                  src={companyFounder}
                  alt="Muhammad Hamza, CEO and Founder of Terqivo"
                  frameClassName="w-full h-full"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-accent/10 text-accent mb-2">
                Leadership
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-foreground">
                Muhammad Hamza
              </h1>
              <p className="text-xl md:text-2xl font-medium text-foreground/90">
                CEO & Founder of Terqivo
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                “Building intelligent software, AI-powered products, and secure digital systems with a long-term product vision.”
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-foreground">About the Founder</h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Muhammad Hamza is the CEO and Founder of Terqivo, a technology company focused on intelligent software, AI-powered products, secure digital systems, and practical automation.
                  </p>
                  <p>
                    As a Full Stack MERN Developer and product builder, he works across frontend development, backend systems, APIs, databases, desktop software, and AI integrations.
                  </p>
                  <p>
                    His long-term direction for Terqivo is to build useful technology products that combine thoughtful user experience, reliable engineering, security, and continuous improvement.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t">
                <h3 className="text-xl font-heading font-bold mb-6 text-foreground">Focus Areas</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-xl border border-border/50">
                    <Cpu className="h-5 w-5 text-accent shrink-0" />
                    <span className="font-medium text-foreground text-sm">AI-Powered Products</span>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-xl border border-border/50">
                    <Code2 className="h-5 w-5 text-accent shrink-0" />
                    <span className="font-medium text-foreground text-sm">Modern Software Engineering</span>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-xl border border-border/50">
                    <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                    <span className="font-medium text-foreground text-sm">Secure Digital Systems</span>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/20 p-4 rounded-xl border border-border/50">
                    <Target className="h-5 w-5 text-accent shrink-0" />
                    <span className="font-medium text-foreground text-sm">Long-Term Product Development</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-12 border-t flex flex-col sm:flex-row items-center gap-4">
                 <Button size="lg" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                   <a href="https://itshamzadev.com" target="_blank" rel="noopener noreferrer">
                     View Portfolio <ArrowUpRight className="ml-2 h-5 w-5" />
                   </a>
                 </Button>
                 <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                   <Link to="/contact">Contact Terqivo</Link>
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
