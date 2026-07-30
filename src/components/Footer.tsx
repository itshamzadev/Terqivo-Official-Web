import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Linkedin, Twitter } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { general } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__lead">
          <p>Have a useful idea?</p>
          <h2>Let’s turn it into software that works beautifully.</h2>
          <Link to="/contact">Start a conversation <ArrowUpRight size={20} /></Link>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Link to="/">{general?.companyName || 'TERQIVO'}</Link>
            <p>{general?.description || 'Independent software company building dependable products, platforms and intelligent tools.'}</p>
          </div>
          <div><h3>Explore</h3><Link to="/services">Services</Link><Link to="/products">Products</Link><Link to="/courses">Courses</Link><Link to="/jobs">Careers</Link></div>
          <div><h3>Company</h3><Link to="/about">About</Link><Link to="/ceo-founder">Founder</Link><Link to="/blog">Journal</Link><Link to="/contact">Contact</Link></div>
          <div><h3>Elsewhere</h3>
            {general?.linkedinUrl && <a href={general.linkedinUrl} target="_blank" rel="noreferrer"><Linkedin size={15}/> LinkedIn</a>}
            {general?.githubUrl && <a href={general.githubUrl} target="_blank" rel="noreferrer"><Github size={15}/> GitHub</a>}
            {general?.twitterUrl && <a href={general.twitterUrl} target="_blank" rel="noreferrer"><Twitter size={15}/> X / Twitter</a>}
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>{general?.footerText || `© ${year} ${general?.companyName || 'Terqivo'}. All rights reserved.`}</p>
          <div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><span>Pakistan</span></div>
        </div>
      </div>
    </footer>
  );
}
