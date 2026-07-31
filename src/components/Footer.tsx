import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { general } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer site-footer-final">
      <div className="site-footer__inner">
        <div className="site-footer__lead">
          <div><p>Have a project in mind?</p><h2>Let’s build software that people can rely on.</h2></div>
          <Link to="/contact">Start a conversation <ArrowUpRight size={19} /></Link>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Link to="/" className="footer-wordmark"><span>T</span>{general?.companyName || 'TERQIVO'}</Link>
            <p>{general?.description || 'Independent software company building dependable products, platforms and intelligent tools.'}</p>
            <div className="footer-socials">
              {general?.linkedinUrl && <a href={general.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17}/></a>}
              {general?.githubUrl && <a href={general.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17}/></a>}
              <Link to="/contact" aria-label="Email"><Mail size={17}/></Link>
            </div>
          </div>
          <div><h3>Services</h3><Link to="/services">Custom software</Link><Link to="/services">Applied AI</Link><Link to="/services">Cloud & backend</Link><Link to="/services">Web & mobile</Link></div>
          <div><h3>Products</h3><Link to="/products">Manos AI</Link><Link to="/products">All products</Link><Link to="/courses">Courses</Link></div>
          <div><h3>Company</h3><Link to="/about">About us</Link><Link to="/ceo-founder">Our founder</Link><Link to="/jobs">Careers</Link><Link to="/contact">Contact</Link></div>
          <div><h3>Resources</h3><Link to="/blog">Blog</Link><Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms of service</Link></div>
        </div>

        <div className="site-footer__bottom">
          <p>{general?.footerText || `© ${year} ${general?.companyName || 'Terqivo'}. All rights reserved.`}</p>
          <div><span>Pakistan</span><span>·</span><a href={`mailto:${general?.email || 'contact@terqivo.com'}`}>{general?.email || 'contact@terqivo.com'}</a></div>
        </div>
      </div>
    </footer>
  );
}
