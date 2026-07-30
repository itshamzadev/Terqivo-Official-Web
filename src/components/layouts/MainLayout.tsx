import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { AnimatePresence, motion } from 'framer-motion';

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('main section, main article, main [class*=\"grid\"] > [class*=\"group\"]'));
    nodes.forEach((node) => node.classList.add('reveal-on-scroll'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -55px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
