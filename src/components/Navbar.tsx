import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2, Moon, Sun } from 'lucide-react';
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled
          ? 'glass-effect border-border py-4'
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          {general?.logoUrl ? (
            <img src={general.logoUrl} alt={general.companyName || 'TERQIVO'} className="h-8" />
          ) : (
            <>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground group-hover:bg-primary-hover transition-colors">
                <Code2 size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">{general?.companyName || 'TERQIVO'}</span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 rounded-full border border-border/70 bg-card/70 backdrop-blur-xl px-3 py-1.5 shadow-[0_10px_35px_rgba(15,35,65,0.08)]" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive ? 'page' : undefined}
                className="relative text-sm font-medium transition-colors hover:text-foreground text-muted-foreground group py-2"
              >
                <span className={isActive ? 'text-foreground' : ''}>{link.title}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
          <div className="h-5 w-px bg-border mx-1" />
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <Link
            to="/contact"
            className="text-sm font-medium bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:bg-primary-hover transition-all hover:scale-105 active:scale-95 shadow-[0_12px_30px_rgba(23,107,255,0.24)] hover:shadow-[0_16px_38px_rgba(23,107,255,0.32)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Get in touch
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label="Toggle color theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        <button
          className="p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle menu"
          aria-controls="mobile-menu"
        >
          <motion.div
            animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </motion.div>
        </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border md:hidden overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    location.pathname.startsWith(link.path)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.title}
                </Link>
              ))}
              <div className="h-px w-full bg-border my-2" />
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-primary flex items-center gap-2 group"
              >
                Contact Us
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  →
                </motion.span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
