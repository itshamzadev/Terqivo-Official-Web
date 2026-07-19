import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowRight, Twitter, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { general } = useSettings();

  return (
    <footer className="border-t border-border/50 bg-secondary/10 pt-24 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-20">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              {general?.logoUrl ? (
                <img src={general.logoUrl} alt={general.companyName || 'TERQIVO'} className="h-8 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100" />
              ) : (
                <>
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground group-hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
                    <Code2 size={20} strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors">{general?.companyName || 'TERQIVO'}</span>
                </>
              )}
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              {general?.description || 'Builds for Generations. We architect, design, and engineer world-class software, AI systems, and technology solutions.'}
            </p>
            <div className="flex gap-4 text-muted-foreground">
              {general?.twitterUrl && (
                <a href={general.twitterUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110">
                  <Twitter size={18} />
                </a>
              )}
              {general?.linkedinUrl && (
                <a href={general.linkedinUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110">
                  <Linkedin size={18} />
                </a>
              )}
              {general?.githubUrl && (
                <a href={general.githubUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110">
                  <Github size={18} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-foreground">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors hover:pl-1 duration-300 inline-block">About Us</Link></li>
              <li><Link to="/jobs" className="hover:text-primary transition-colors hover:pl-1 duration-300 inline-block">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors hover:pl-1 duration-300 inline-block">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors hover:pl-1 duration-300 inline-block">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-foreground">Services</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link to="/services" className="hover:text-primary transition-colors hover:pl-1 duration-300 inline-block">Custom Software</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors hover:pl-1 duration-300 inline-block">AI Solutions</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors hover:pl-1 duration-300 inline-block">Cloud Infrastructure</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors hover:pl-1 duration-300 inline-block">UI/UX Design</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-foreground">Connect</h4>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Ready to build the future? Reach out to our engineering team.
            </p>
            <Link to="/contact" className="group inline-flex items-center gap-2 text-sm font-medium text-foreground bg-secondary/80 border border-border/50 px-5 py-2.5 rounded-full hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300">
              Start a project 
              <motion.span
                className="inline-block"
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                group-hover={{ x: 3 }}
              >
                <ArrowRight size={16} />
              </motion.span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 text-sm text-muted-foreground">
          <p>{general?.footerText || `© ${new Date().getFullYear()} ${general?.companyName || 'TERQIVO'}. All rights reserved.`}</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
