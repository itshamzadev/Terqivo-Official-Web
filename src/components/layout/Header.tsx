import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, UserCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../auth/AuthContext';
import { BrandLogo } from './BrandLogo';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Company', path: '/about' },
    { name: 'Solutions', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Courses', path: '/courses' },
    { name: 'Insights', path: '/blog' },
    { name: 'Careers', path: '/jobs' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/90 backdrop-blur-md border-b shadow-sm py-3' 
            : 'bg-background py-5 border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm" aria-label="Terqivo Home">
              <BrandLogo />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`text-sm font-medium transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1 py-0.5 ${
                    isActive(link.path) ? 'text-accent' : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? <div className="flex items-center gap-2 text-sm"><UserCircle className="h-5 w-5 text-accent" /><Link to="/account" className="font-medium hover:text-accent">{user?.username || user?.name}</Link>{!user?.emailVerified && <span className="text-xs text-amber-600">Verify email</span>}<button onClick={() => void logout()} className="text-muted-foreground hover:text-destructive">Log out</button></div> : <div className="flex items-center gap-2"><Button variant="ghost" asChild><Link to="/login">Log in</Link></Button><Button variant="outline" asChild><Link to="/signup">Sign Up</Link></Button></div>}
              <Button variant="ghost" asChild className="hidden xl:inline-flex">
                 <Link to="/products">Explore Products</Link>
              </Button>
              <Button asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -mr-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md relative z-50"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-background pt-[88px] px-4 overflow-y-auto lg:hidden"
          >
            <div className="container mx-auto max-w-md flex flex-col min-h-[calc(100vh-88px)] pb-8">
              <nav className="flex flex-col gap-6 py-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    className={`text-2xl font-heading font-bold transition-colors ${
                      isActive(link.path) ? 'text-accent' : 'text-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto pt-8 space-y-4">
                {isAuthenticated ? <div className="space-y-3"><Button variant="outline" className="w-full h-14 text-lg" asChild><Link to="/account">Account{!user?.emailVerified ? ' · Verify email' : ''}</Link></Button><Button variant="ghost" className="w-full" onClick={() => void logout()}>Log out</Button></div> : <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="h-12" asChild><Link to="/login">Log in</Link></Button><Button className="h-12" asChild><Link to="/signup">Sign Up</Link></Button></div>}
                <Button className="w-full h-14 text-lg" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
                <Button variant="outline" className="w-full h-14 text-lg" asChild>
                  <Link to="/products">Explore Products</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
