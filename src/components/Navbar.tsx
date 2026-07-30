import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Moon, Sun, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { title: 'Services', path: '/services' },
  { title: 'Products', path: '/products' },
  { title: 'Courses', path: '/courses' },
  { title: 'Jobs', path: '/jobs' },
  { title: 'Company', path: '/about' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { general } = useSettings();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location.pathname]);

  return (
    <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }} className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <Link to="/" className="site-wordmark" aria-label="Terqivo home">
          <span className="site-wordmark__mark" aria-hidden="true">T</span>
          <span>{general?.companyName || 'TERQIVO'}</span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {navLinks.map((link) => {
            const active = location.pathname.startsWith(link.path);
            return <Link key={link.path} to={link.path} className={active ? 'is-active' : ''}>{link.title}</Link>;
          })}
        </nav>

        <div className="site-header__actions">
          <button type="button" onClick={toggleTheme} className="site-icon-button" aria-label="Toggle color theme">
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <Link to="/contact" className="site-contact-link">Start a project <ArrowUpRight size={15} /></Link>
          <button type="button" className="site-menu-button" onClick={() => setMobileMenuOpen((value) => !value)} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav id="mobile-navigation" className="site-mobile-nav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {navLinks.map((link) => <Link key={link.path} to={link.path}>{link.title}<ArrowUpRight size={16} /></Link>)}
            <Link to="/contact" className="site-mobile-nav__contact">Start a project <ArrowUpRight size={18} /></Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
