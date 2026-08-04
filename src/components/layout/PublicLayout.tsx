import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AnnouncementBar } from './AnnouncementBar';
import { SeoHead } from './SeoHead';
import { AmbientPageDecor } from './AmbientPageDecor';

export function PublicLayout() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <AmbientPageDecor />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SeoHead />
        <AnnouncementBar />
        <Header />
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
        <Footer />
      </div>
    </div>
  );
}
