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
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location.pathname]);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}
    >
      <div className="site-header__inner">
        <Link to="/" className="site-wordmark" aria-label="Terqivo home">
          {general?.logoUrl ? (
            <img src={general.logoUrl} alt={general.companyName || 'TERQIVO'} />
          ) : (
            <>
              <span className="site-wordmark__mark" aria-hidden="true">T</span>
              <span>{general?.companyName || 'TERQIVO'}</span>
            </>
          )}
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {navLinks.map((link) => {
            const active = location.pathname.startsWith(link.path);
            return (
              <Link key={link.path} to={link.path} className={active ? 'is-active' : ''} aria-current={active ? 'page' : undefined}>
                {link.title}
              </Link>
            );
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
          <motion.nav id="mobile-navigation" className="site-mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>
            {navLinks.map((link, index) => (
              <motion.div key={link.path} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.035 }}>
                <Link to={link.path}>{link.title}<span>0{index + 1}</span></Link>
              </motion.div>
            ))}
            <Link to="/contact" className="site-mobile-nav__contact">Start a project <ArrowUpRight size={18} /></Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
