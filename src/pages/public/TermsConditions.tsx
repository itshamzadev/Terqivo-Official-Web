import { useEffect } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Mail, Phone, Globe } from 'lucide-react';
import { useSettings } from '../../components/SettingsContext';

export default function TermsConditions() {
  const { settings } = useSettings();

  useEffect(() => {
    document.title = "Terms & Conditions | Terqivo";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', "Read Terqivo's Terms & Conditions. Learn about the rules, guidelines, and agreements for using our software, AI products, and digital services.");
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="bg-muted/30 pt-24 pb-10 border-b">
        <div className="container mx-auto px-4 max-w-[860px]">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-accent/5 text-accent mb-6">
            Legal & Compliance
          </div>
          <h1 className="text-[36px] md:text-[48px] font-heading font-bold mb-4 text-foreground tracking-tight leading-[1.2]">
            Terms & Conditions
          </h1>
          <p className="text-xl text-muted-foreground font-sans">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="pt-10 pb-12 md:pb-16">
        <div className="container mx-auto px-4 max-w-[860px]">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0 space-y-12 md:space-y-14 prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
              
              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">1. Introduction</h2>
                <p className="text-[16px] leading-[1.8]">
                  Welcome to Terqivo. These Terms & Conditions ("Terms") govern your access to and use of our website, software applications, AI-powered products, APIs, and digital services (collectively, the "Services") provided by Terqivo ("we," "us," or "our").
                </p>
                <p className="text-[16px] leading-[1.8]">
                  By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use our Services.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">2. Acceptance of Terms</h2>
                <p className="text-[16px] leading-[1.8]">
                  These Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Terqivo. We may modify these Terms at any time by posting a revised version. Your continued use of the Services indicates your acceptance of the updated Terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">3. Eligibility</h2>
                <p className="text-[16px] leading-[1.8]">
                  You must be at least 18 years of age to create an account or use our Services. By using the Services, you represent and warrant that you possess the legal capacity and authority to enter into these Terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">4. User Accounts</h2>
                <p className="text-[16px] leading-[1.8]">
                  Certain features of our Services may require you to register for an account. When you create an account, you agree to:
                </p>
                <ul className="!list-outside list-disc !pl-6 mt-3 mb-4 text-[16px] leading-[1.8] text-muted-foreground [&>li]:!mt-0 [&>li]:!mb-[10px] [&>li]:!pl-2 marker:text-muted-foreground">
                  <li>Provide accurate, current, and complete information.</li>
                  <li>Maintain and promptly update your account information.</li>
                  <li>Keep your password secure and confidential.</li>
                  <li>Accept full responsibility for all activities that occur under your account.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">5. Acceptable Use Policy</h2>
                <p className="text-[16px] leading-[1.8]">
                  You agree to use our Services only for lawful purposes. You are strictly prohibited from:
                </p>
                <ul className="!list-outside list-disc !pl-6 mt-3 mb-4 text-[16px] leading-[1.8] text-muted-foreground [&>li]:!mt-0 [&>li]:!mb-[10px] [&>li]:!pl-2 marker:text-muted-foreground">
                  <li>Engaging in any activity that violates any applicable law or regulation.</li>
                  <li>Interfering with, disrupting, or attempting to gain unauthorized access to our servers or networks.</li>
                  <li>Using our AI products to generate harmful, abusive, or illegal content.</li>
                  <li>Reverse-engineering, decompiling, or disassembling any portion of our software or Services.</li>
                  <li>Using automated scripts, scrapers, or bots to interact with our Services without our explicit permission.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">6. Intellectual Property</h2>
                <p className="text-[16px] leading-[1.8]">
                  All content, source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Services (collectively, the "Content") and the trademarks, service marks, and logos contained therein are owned or controlled by Terqivo and are protected by copyright and trademark laws.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">7. Software Licenses</h2>
                <p className="text-[16px] leading-[1.8]">
                  If we provide you with software (such as desktop applications, SaaS platforms, or scripts), we grant you a personal, non-exclusive, non-transferable, limited license to use the software solely in connection with the Services and strictly in accordance with these Terms. This license does not grant you the right to modify, distribute, sell, or lease any part of our software.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">8. Product Availability</h2>
                <p className="text-[16px] leading-[1.8]">
                  We strive to ensure our Services are consistently available, but we cannot guarantee uninterrupted access. We reserve the right to modify, update, suspend, or discontinue any product, service, or feature at any time without notice or liability.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">9. Purchases & Payments</h2>
                <p className="text-[16px] leading-[1.8]">
                  When you purchase a product, subscription, or course through our Services, you agree to provide current, complete, and accurate purchase and account information. You agree to pay all charges at the prices then in effect for your purchases, and you authorize us to charge your chosen payment provider. We reserve the right to correct any errors or mistakes in pricing.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">10. Refund Policy</h2>
                <p className="text-[16px] leading-[1.8]">
                  All sales of software, digital products, and subscriptions are final and non-refundable unless otherwise explicitly stated on the specific product page or required by applicable law. We encourage you to review the product features carefully before making a purchase.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">11. Third-Party Services</h2>
                <p className="text-[16px] leading-[1.8]">
                  Our Services may contain links to third-party websites or services, or integrate with third-party tools (such as payment gateways or analytics providers). We do not endorse and are not responsible for the content, privacy policies, or practices of any third-party services.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">12. User Content</h2>
                <p className="text-[16px] leading-[1.8]">
                  You may be able to submit, upload, or post content through our Services. You retain ownership of your content, but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content to provide and improve the Services. You represent that you have the right to share the content and that it does not infringe on any third-party rights.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">13. Privacy</h2>
                <p className="text-[16px] leading-[1.8]">
                  We care about data privacy and security. Please review our Privacy Policy to understand how we collect, use, and protect your personal information. By using the Services, you agree to our data practices as described in the Privacy Policy.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">14. Disclaimer of Warranties</h2>
                <p className="text-[16px] leading-[1.8]">
                  The Services are provided on an "as is" and "as available" basis. To the fullest extent permitted by law, Terqivo disclaims all warranties, express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We make no warranty that the Services will meet your requirements or be available on an uninterrupted, secure, or error-free basis.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">15. Limitation of Liability</h2>
                <p className="text-[16px] leading-[1.8]">
                  In no event will Terqivo, our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profits, lost revenue, loss of data, or other damages arising from your use of the Services, even if we have been advised of the possibility of such damages.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">16. Indemnification</h2>
                <p className="text-[16px] leading-[1.8]">
                  You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand made by any third party due to or arising out of your use of the Services or breach of these Terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">17. Suspension & Termination</h2>
                <p className="text-[16px] leading-[1.8]">
                  We reserve the right, in our sole discretion, to terminate or suspend your account and your access to the Services, with or without notice, if you breach these Terms, engage in illegal activity, or for any other reason we deem necessary to protect our platform and users.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">18. Governing Law</h2>
                <p className="text-[16px] leading-[1.8]">
                  These Terms and your use of the Services shall be governed by and construed in accordance with applicable laws, without regard to conflicts of law principles.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">19. Changes to Terms</h2>
                <p className="text-[16px] leading-[1.8]">
                  We reserve the right to modify these Terms at any time. We will alert you about any changes by updating the "Last Updated" date of these Terms. You are encouraged to periodically review these Terms to stay informed of updates. Your continued use of the Services after the revised Terms are posted constitutes your acceptance.
                </p>
              </div>

              <div className="pt-8 border-t border-border mt-8">
                <h2 className="text-[28px] font-heading font-bold text-foreground mb-4">20. Contact Information</h2>
                <p className="text-[16px] leading-[1.8] mb-6">
                  If you have any questions, concerns, or feedback regarding these Terms & Conditions, please contact us at:
                </p>
                
                <div className="bg-muted/30 border rounded-2xl p-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1 text-[16px]">Email</p>
                      <a href={`mailto:${settings?.contact?.email || 'hello@terqivo.com'}`} className="text-accent hover:underline transition-colors font-medium text-[16px]">
                        {settings?.contact?.email || 'hello@terqivo.com'}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1 text-[16px]">Phone / WhatsApp</p>
                      <a href={`tel:${(settings?.contact?.phone || '+923708121767').replace(/\s+/g, '')}`} className="text-accent hover:underline transition-colors font-medium text-[16px]">
                        {settings?.contact?.phone || '+92 370 812 1767'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                      <Globe className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1 text-[16px]">Company</p>
                      <p className="font-medium text-foreground text-[16px]">{settings?.general?.companyName || 'Terqivo'} ({settings?.contact?.locationLabel || 'Remote-First Company'})</p>
                      <p className="text-muted-foreground mt-0.5 text-[15px]">{settings?.contact?.locationDescription || 'Serving clients worldwide.'}</p>
                    </div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
