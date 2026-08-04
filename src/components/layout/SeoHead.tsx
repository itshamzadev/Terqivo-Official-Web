import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../SettingsContext';

const SITE_URL = 'https://terqivo.com';
const DEFAULT_TITLE = 'Terqivo | Software Engineering, AI & Digital Products';
const DEFAULT_DESCRIPTION = 'Terqivo is a Pakistan-based software engineering company building dependable web platforms, AI products, automation systems, and secure digital solutions.';
const DEFAULT_IMAGE = `${SITE_URL}/brand/terqivo-logo.png`;

const pageMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  '/about': {
    title: 'About Terqivo | Software & AI Engineering Company',
    description: 'Meet Terqivo, a Pakistan-based technology company building practical software, AI-powered products, and secure digital systems for ambitious teams.',
  },
  '/services': {
    title: 'Software Engineering & AI Solutions | Terqivo',
    description: "Explore Terqivo's software engineering, applied AI, automation, cloud, and secure digital solution capabilities.",
  },
  '/products': {
    title: 'Digital Products & AI Tools | Terqivo',
    description: "Explore Terqivo's practical digital products, software platforms, and AI-powered tools built for modern teams.",
  },
  '/courses': {
    title: 'Technology Courses & Training | Terqivo',
    description: "Build practical software, AI, and digital skills with Terqivo's technology courses and professional training.",
  },
  '/blog': {
    title: 'Terqivo Insights | Software, AI & Digital Systems',
    description: 'Read Terqivo insights on software engineering, applied AI, automation, product development, and secure digital systems.',
  },
  '/jobs': {
    title: 'Careers at Terqivo | Software & AI Engineering Jobs',
    description: 'Join Terqivo and help build dependable software, AI products, and digital systems for teams around the world.',
  },
  '/contact': {
    title: 'Contact Terqivo | Build Reliable Software',
    description: 'Talk to Terqivo about software engineering, AI product development, automation, and secure digital systems.',
  },
  '/about/ceo': {
    title: 'Muhammad Hamza | CEO & Founder of Terqivo',
    description: 'Learn about Muhammad Hamza, CEO and Founder of Terqivo, and his work in intelligent software, AI products, and modern digital systems.',
  },
};

function getPageMetadata(pathname: string, fallbackTitle: string, fallbackDescription: string) {
  const exactMatch = pageMetadata[pathname];
  if (exactMatch) return exactMatch;

  if (pathname.startsWith('/services/')) {
    return {
      title: `Software Solution | ${fallbackTitle.split('|')[0].trim()}`,
      description: 'Explore a Terqivo software, AI, automation, or digital solution built for dependable real-world outcomes.',
    };
  }

  if (pathname.startsWith('/products/')) {
    return {
      title: `Digital Product | ${fallbackTitle.split('|')[0].trim()}`,
      description: 'Discover a Terqivo digital product designed to help modern teams work smarter and move faster.',
    };
  }

  if (pathname.startsWith('/courses/')) {
    return {
      title: `Technology Course | ${fallbackTitle.split('|')[0].trim()}`,
      description: 'Learn practical software, AI, and digital skills through a Terqivo technology course.',
    };
  }

  if (pathname.startsWith('/jobs/')) {
    return {
      title: `Careers at Terqivo | ${fallbackTitle.split('|')[0].trim()}`,
      description: 'Explore an opportunity to build practical software, AI products, and secure digital systems with Terqivo.',
    };
  }

  if (pathname.startsWith('/blog/')) {
    return {
      title: `Terqivo Insights | ${fallbackTitle.split('|')[0].trim()}`,
      description: 'Read Terqivo perspectives on software engineering, AI, automation, and digital product development.',
    };
  }

  return { title: fallbackTitle, description: fallbackDescription };
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function SeoHead() {
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    const fallbackTitle = settings.seo.defaultTitle || DEFAULT_TITLE;
    const fallbackDescription = settings.seo.defaultDescription || DEFAULT_DESCRIPTION;
    const { title, description } = getPageMetadata(location.pathname, fallbackTitle, fallbackDescription);
    const normalizedPath = location.pathname === '/' ? '' : location.pathname.replace(/\/$/, '');
    const canonicalUrl = `${SITE_URL}${normalizedPath}`;
    const imageUrl = settings.seo.ogImageUrl
      ? new URL(settings.seo.ogImageUrl, SITE_URL).toString()
      : DEFAULT_IMAGE;

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:site_name', 'Terqivo');
    setMeta('property', 'og:type', location.pathname.startsWith('/blog/') ? 'article' : 'website');
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', imageUrl);
    setMeta('property', 'og:image:alt', 'Terqivo logo');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', imageUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let pageSchema = document.head.querySelector('#terqivo-page-schema') as HTMLScriptElement | null;
    if (!pageSchema) {
      pageSchema = document.createElement('script');
      pageSchema.id = 'terqivo-page-schema';
      pageSchema.type = 'application/ld+json';
      document.head.appendChild(pageSchema);
    }
    pageSchema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
    });
  }, [location.pathname, settings.seo.defaultDescription, settings.seo.defaultTitle, settings.seo.ogImageUrl]);

  return null;
}
