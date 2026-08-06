import { useEffect } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Mail, Phone, Globe } from 'lucide-react';
import { useSettings } from '../../components/SettingsContext';

export default function PrivacyPolicy() {
  const { settings } = useSettings();

  useEffect(() => {
    document.title = "Privacy Policy | Terqivo";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', "Read Terqivo's Privacy Policy to understand how we collect, use, protect, and manage your information while using our software, AI products, and digital services.");
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="bg-muted/30 pt-24 pb-10 border-b">
        <div className="container mx-auto px-4 max-w-[860px]">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-accent/5 text-accent mb-6">
            Legal & Compliance
          </div>
          <h1 className="text-[48px] font-heading font-bold mb-4 text-foreground tracking-tight leading-[1.2]">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground font-sans">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="pt-10 pb-12 md:pb-16">
        <div className="container mx-auto px-4 max-w-[860px]">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0 space-y-10 md:space-y-12 prose prose-slate max-w-none text-muted-foreground">
              
              <div className="space-y-4">
                <h2 className="text-[32px] font-heading font-bold text-foreground mb-4">1. Introduction</h2>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  Terqivo ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our software applications, AI-powered products, and digital services (collectively, the "Services").
                </p>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Services.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[32px] font-heading font-bold text-foreground mb-4">2. Information We Collect</h2>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  We may collect information about you in various ways when you interact with our Services. The information we may collect includes:
                </p>
                <ul className="!list-outside list-disc !pl-6 mt-3 mb-4 text-[14px] md:text-[15px] lg:text-[16px] leading-[1.75] text-muted-foreground [&>li]:!mt-0 [&>li]:!mb-[10px] [&>li]:!pl-2 marker:text-muted-foreground">
                  <li><span className="font-semibold text-foreground">Contact Information:</span> Such as your name, email address, and phone number when you fill out forms or communicate with us.</li>
                  <li><span className="font-semibold text-foreground">Account Information:</span> If you create an account, we may collect your username, password, and profile details.</li>
                  <li><span className="font-semibold text-foreground">Technical Information:</span> Including your IP address, browser type, operating system, and device identifiers automatically collected when you access our Services.</li>
                  <li><span className="font-semibold text-foreground">Device Information:</span> Data about the computer, phone, or other device you use to connect to our Services.</li>
                  <li><span className="font-semibold text-foreground">Usage Analytics:</span> Information about your interactions with our website, such as pages visited, links clicked, and time spent on pages.</li>
                  <li><span className="font-semibold text-foreground">Cookies:</span> Data stored on your device to enhance your experience and analyze usage (see Section 4).</li>
                  <li><span className="font-semibold text-foreground">Communication Data:</span> Records of your correspondence with our support team or general inquiries.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-[32px] font-heading font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  Accurate information helps us provide a smooth, efficient, and personalized experience. Specifically, we may use information collected about you through our Services to:
                </p>
                <ul className="!list-outside list-disc !pl-6 mt-3 mb-4 text-[14px] md:text-[15px] lg:text-[16px] leading-[1.75] text-muted-foreground [&>li]:!mt-0 [&>li]:!mb-[10px] [&>li]:!pl-2 marker:text-muted-foreground">
                  <li><span className="font-semibold text-foreground">Customer support:</span> To respond to your inquiries, troubleshoot issues, and provide technical assistance.</li>
                  <li><span className="font-semibold text-foreground">Product improvement:</span> To analyze usage trends, evaluate new features, and enhance our software and AI products.</li>
                  <li><span className="font-semibold text-foreground">Security:</span> To monitor against unauthorized access, prevent fraudulent activity, and ensure the safety of our systems.</li>
                  <li><span className="font-semibold text-foreground">Authentication:</span> To verify your identity and manage access to your account.</li>
                  <li><span className="font-semibold text-foreground">Account management:</span> To create and manage your account and deliver requested services.</li>
                  <li><span className="font-semibold text-foreground">Legal compliance:</span> To comply with applicable legal obligations and resolve any disputes.</li>
                  <li><span className="font-semibold text-foreground">Service communications:</span> To send administrative information, updates, and important notices regarding our Services.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-[32px] font-heading font-bold text-foreground mb-4">4. Cookies & Tracking Technologies</h2>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  We use cookies, web beacons, tracking pixels, and other tracking technologies on our Services to help customize and improve your experience.
                </p>
                <ul className="!list-outside list-disc !pl-6 mt-3 mb-4 text-[14px] md:text-[15px] lg:text-[16px] leading-[1.75] text-muted-foreground [&>li]:!mt-0 [&>li]:!mb-[10px] [&>li]:!pl-2 marker:text-muted-foreground">
                  <li><span className="font-semibold text-foreground">Essential Cookies:</span> Necessary for the operation of our Services, enabling core functionality such as security, network management, and accessibility.</li>
                  <li><span className="font-semibold text-foreground">Analytics Cookies:</span> Allow us to recognize and count the number of visitors and see how visitors move around our Services to improve how they work.</li>
                  <li><span className="font-semibold text-foreground">Preference Cookies:</span> Used to recognize you when you return to our Services, enabling us to personalize our content for you and remember your preferences.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-[32px] font-heading font-bold text-foreground mb-4">5. Data Security</h2>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  We use administrative, technical, and physical security measures to help protect your personal information. Our security practices include:
                </p>
                <ul className="!list-outside list-disc !pl-6 mt-3 mb-4 text-[14px] md:text-[15px] lg:text-[16px] leading-[1.75] text-muted-foreground [&>li]:!mt-0 [&>li]:!mb-[10px] [&>li]:!pl-2 marker:text-muted-foreground">
                  <li><span className="font-semibold text-foreground">Encryption:</span> Protecting sensitive data in transit and at rest using industry-standard encryption protocols.</li>
                  <li><span className="font-semibold text-foreground">Secure authentication:</span> Employing robust mechanisms to verify user identities and prevent unauthorized account access.</li>
                  <li><span className="font-semibold text-foreground">Access controls:</span> Restricting access to personal information to authorized personnel on a need-to-know basis.</li>
                  <li><span className="font-semibold text-foreground">Security monitoring:</span> Continuously monitoring our systems for vulnerabilities and potential threats.</li>
                  <li><span className="font-semibold text-foreground">Regular security improvements:</span> Updating our security practices to adapt to emerging risks and maintain a secure environment.</li>
                </ul>
                <p className="text-[17px] md:text-[18px] leading-[1.7] text-sm mt-4">
                  While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[32px] font-heading font-bold text-foreground mb-4">6. Data Retention</h2>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  We will retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. The specific retention period varies depending on the nature of the data and the purpose for which it is processed.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[32px] font-heading font-bold text-foreground mb-4">7. Third-Party Services</h2>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf. These may include:
                </p>
                <ul className="!list-outside list-disc !pl-6 mt-3 mb-4 text-[14px] md:text-[15px] lg:text-[16px] leading-[1.75] text-muted-foreground [&>li]:!mt-0 [&>li]:!mb-[10px] [&>li]:!pl-2 marker:text-muted-foreground">
                  <li><span className="font-semibold text-foreground">Payment providers:</span> To process secure transactions for our products and services.</li>
                  <li><span className="font-semibold text-foreground">Email providers:</span> To manage and deliver communications, updates, and newsletters.</li>
                  <li><span className="font-semibold text-foreground">Analytics providers:</span> To help us understand how our Services are used and identify areas for improvement.</li>
                </ul>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[32px] font-heading font-bold text-foreground mb-4">8. International Users</h2>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  Terqivo serves clients worldwide. If you are accessing our Services from outside the region where our servers are located, please be aware that your information may be transferred to, stored, and processed by us in our facilities and by those third parties with whom we may share your personal information.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[32px] font-heading font-bold text-foreground mb-4">9. Children's Privacy</h2>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  Our Services are not intended for or directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information as quickly as possible.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[32px] font-heading font-bold text-foreground mb-4">10. Your Rights</h2>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  Depending on your location and applicable laws, you may have certain rights regarding your personal information, including the right to:
                </p>
                <ul className="!list-outside list-disc !pl-6 mt-3 mb-4 text-[14px] md:text-[15px] lg:text-[16px] leading-[1.75] text-muted-foreground [&>li]:!mt-0 [&>li]:!mb-[10px] [&>li]:!pl-2 marker:text-muted-foreground">
                  <li><span className="font-semibold text-foreground">Access:</span> Request a copy of the personal data we hold about you.</li>
                  <li><span className="font-semibold text-foreground">Correction:</span> Request that we correct any inaccurate or incomplete personal data.</li>
                  <li><span className="font-semibold text-foreground">Deletion:</span> Request that we delete your personal data in certain circumstances.</li>
                  <li><span className="font-semibold text-foreground">Data portability:</span> Request the transfer of your personal data to you or a third party (where applicable).</li>
                  <li><span className="font-semibold text-foreground">Withdraw consent:</span> Withdraw your consent at any time where we are relying on consent to process your personal data.</li>
                </ul>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  To exercise any of these rights, please contact us using the information provided in Section 12.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-[32px] font-heading font-bold text-foreground mb-4">11. Policy Updates</h2>
                <p className="text-[17px] md:text-[18px] leading-[1.7]">
                  We may update this Privacy Policy from time to time in order to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.
                </p>
              </div>

              <div className="pt-8 border-t border-border mt-8">
                <h2 className="text-[32px] font-heading font-bold text-foreground mb-4">12. Contact Us</h2>
                <p className="text-[17px] md:text-[18px] leading-[1.7] mb-6">
                  If you have questions or comments about this Privacy Policy or our data practices, please contact us at:
                </p>
                
                <div className="bg-muted/30 border rounded-2xl p-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1 text-[17px]">Email</p>
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
                      <p className="font-semibold text-foreground mb-1 text-[17px]">Phone / WhatsApp</p>
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
                      <p className="font-semibold text-foreground mb-1 text-[17px]">Location</p>
                      <p className="font-medium text-foreground text-[16px]">Remote-First Company</p>
                      <p className="text-muted-foreground mt-0.5 text-[15px]">Serving clients worldwide.</p>
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
