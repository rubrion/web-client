import React, { useEffect } from 'react';

interface PageHelmetProps {
  title: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  children: React.ReactNode;
}

const PageHelmet: React.FC<PageHelmetProps> = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard = 'summary_large_image',
  canonicalUrl,
  children,
}) => {
  useEffect(() => {
    if (!title) {
      console.warn("PageHelmet: 'title' is missing or undefined.");
      return;
    }

    // Set page title
    document.title = title;

    // Helper function to set or update meta tag
    const setMetaTag = (name: string, content: string, property = false) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let metaTag = document.querySelector(selector) as HTMLMetaElement | null;

      if (!metaTag) {
        metaTag = document.createElement('meta') as HTMLMetaElement;
        if (property) {
          metaTag.setAttribute('property', name);
        } else {
          metaTag.setAttribute('name', name);
        }
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    // Set canonical URL
    if (canonicalUrl) {
      let linkCanonical = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement | null;
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = canonicalUrl;
    }

    // Basic meta tags
    if (description) {
      setMetaTag('description', description);
    }

    if (keywords) {
      setMetaTag('keywords', keywords);
    }

    // Open Graph meta tags
    setMetaTag('og:title', ogTitle || title, true);
    if (ogDescription || description) {
      setMetaTag('og:description', ogDescription || description || '', true);
    }
    setMetaTag('og:type', 'website', true);

    if (ogUrl) {
      setMetaTag('og:url', ogUrl, true);
    }

    if (ogImage) {
      setMetaTag('og:image', ogImage, true);
      setMetaTag('og:image:alt', `${title} - Rubrion`, true);
    }

    setMetaTag('og:site_name', 'Rubrion', true);

    // Twitter Card meta tags
    setMetaTag('twitter:card', twitterCard);
    setMetaTag('twitter:title', ogTitle || title);
    if (ogDescription || description) {
      setMetaTag('twitter:description', ogDescription || description || '');
    }
    if (ogImage) {
      setMetaTag('twitter:image', ogImage);
    }

    // Additional SEO meta tags
    setMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('author', 'Rubrion');
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Core Web Vitals and Performance hints
    setMetaTag('theme-color', '#ff0040');
    setMetaTag('color-scheme', 'dark');
    setMetaTag('format-detection', 'telephone=no');

    // Language and locale
    setMetaTag('language', 'en-US');
    setMetaTag('geo.region', 'BR');
    setMetaTag('geo.placename', 'Brazil');

    // Additional Open Graph tags for better social sharing
    setMetaTag('og:locale', 'en_US', true);
    setMetaTag('og:locale:alternate', 'pt_BR', true);

    // Twitter specific optimizations
    setMetaTag('twitter:site', '@rubrion');
    setMetaTag('twitter:creator', '@rubrion');

    // Add preconnect and dns-prefetch for performance
    const addResourceHint = (href: string, rel: string, crossorigin = false) => {
      const existing = document.querySelector(`link[href="${href}"][rel="${rel}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (crossorigin) link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    };

    addResourceHint('https://fonts.googleapis.com', 'preconnect', true);
    addResourceHint('https://fonts.gstatic.com', 'preconnect', true);
    addResourceHint('https://www.google.com', 'dns-prefetch');
    addResourceHint('https://www.gstatic.com', 'dns-prefetch');

    // JSON-LD Structured Data for Organization
    const existingJsonLd = document.querySelector('#rubrion-jsonld');
    if (!existingJsonLd) {
      const jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'rubrion-jsonld';
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': ['Organization', 'SoftwareApplication'],
        name: 'Rubrion',
        alternateName: 'Rubrion AI',
        description:
          'White-label SaaS modules with transparent infrastructure costs. No vendor lock-in, no hidden fees, just value in the service.',
        url: 'https://rubrion.ai',
        logo: {
          '@type': 'ImageObject',
          url: 'https://rubrion.ai/logo_rubrion_ver4.png',
          width: 192,
          height: 192
        },
        foundingDate: '2024',
        sameAs: [
          'https://github.com/rubrion',
          'https://linkedin.com/company/rubrion',
          'https://twitter.com/rubrion'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'hello@rubrion.ai',
          contactType: 'customer service',
          availableLanguage: ['English', 'Portuguese'],
          areaServed: 'Worldwide'
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'BR',
          addressRegion: 'Brazil'
        },
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web Browser',
        offers: [
          {
            '@type': 'Offer',
            name: 'White-Label SaaS Solutions',
            category: 'SaaS Solutions',
            description: 'Complete white-label SaaS modules including CMS, e-commerce, LMS, and more',
            availability: 'https://schema.org/InStock',
            priceSpecification: {
              '@type': 'PriceSpecification',
              priceCurrency: 'USD',
              price: 'Contact for pricing'
            }
          }
        ],
        serviceType: [
          'Software as a Service',
          'White-Label Solutions',
          'Cloud Infrastructure',
          'Custom Development'
        ],
        keywords: [
          'white-label saas',
          'saas modules',
          'cloud infrastructure',
          'kubernetes',
          'terraform',
          'cms',
          'ecommerce',
          'lms',
          'multi-tenant'
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          reviewCount: '1',
          bestRating: '5',
          worstRating: '1'
        }
      });
      document.head.appendChild(jsonLdScript);
    }
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard,
    canonicalUrl,
  ]);

  return <>{children}</>;
};

export default PageHelmet;
