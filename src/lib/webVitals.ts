/**
 * Core Web Vitals measurement and optimization utilities
 * Implements Google's Core Web Vitals metrics for better SEO performance
 */

// Types for Web Vitals metrics
interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// Core Web Vitals thresholds (Google's recommended values)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
  INP: { good: 200, poor: 500 },   // Interaction to Next Paint
};

// Rating function based on thresholds
const getRating = (value: number, thresholds: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' => {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
};

// Send metrics to analytics (Google Analytics 4 example)
const sendToAnalytics = (metric: WebVitalMetric) => {
  // Send to Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Send to console for development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  }
};

// Measure Largest Contentful Paint (LCP)
const measureLCP = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      
      if (lastEntry) {
        const value = lastEntry.renderTime || lastEntry.loadTime || 0;
        const metric: WebVitalMetric = {
          name: 'LCP',
          value,
          rating: getRating(value, THRESHOLDS.LCP),
          delta: value,
          id: `lcp-${Date.now()}`,
        };
        sendToAnalytics(metric);
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }
};

// Measure First Input Delay (FID)
const measureFID = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const metric: WebVitalMetric = {
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          rating: getRating(entry.processingStart - entry.startTime, THRESHOLDS.FID),
          delta: entry.processingStart - entry.startTime,
          id: `fid-${Date.now()}`,
        };
        sendToAnalytics(metric);
      });
    });
    
    observer.observe({ entryTypes: ['first-input'] });
  }
};

// Measure Cumulative Layout Shift (CLS)
const measureCLS = () => {
  if ('PerformanceObserver' in window) {
    let clsValue = 0;
    let clsEntries: any[] = [];
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });
      
      const metric: WebVitalMetric = {
        name: 'CLS',
        value: clsValue,
        rating: getRating(clsValue, THRESHOLDS.CLS),
        delta: clsValue,
        id: `cls-${Date.now()}`,
      };
      sendToAnalytics(metric);
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
  }
};

// Measure First Contentful Paint (FCP)
const measureFCP = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          const metric: WebVitalMetric = {
            name: 'FCP',
            value: entry.startTime,
            rating: getRating(entry.startTime, THRESHOLDS.FCP),
            delta: entry.startTime,
            id: `fcp-${Date.now()}`,
          };
          sendToAnalytics(metric);
        }
      });
    });
    
    observer.observe({ entryTypes: ['paint'] });
  }
};

// Measure Time to First Byte (TTFB)
const measureTTFB = () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      const metric: WebVitalMetric = {
        name: 'TTFB',
        value: ttfb,
        rating: getRating(ttfb, THRESHOLDS.TTFB),
        delta: ttfb,
        id: `ttfb-${Date.now()}`,
      };
      sendToAnalytics(metric);
    }
  }
};

// Initialize all Web Vitals measurements
export const initWebVitals = () => {
  // Only measure in production or when explicitly enabled
  if (import.meta.env.PROD || import.meta.env.VITE_MEASURE_WEB_VITALS === 'true') {
    measureLCP();
    measureFID();
    measureCLS();
    measureFCP();
    measureTTFB();
  }
};

// Performance optimization utilities
export const optimizeImages = () => {
  // Add loading="lazy" to images that are not above the fold
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach((img, index) => {
    // First 3 images are likely above the fold, load them eagerly
    if (index > 2) {
      img.setAttribute('loading', 'lazy');
    }
  });
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/logo_rubrion_ver4.svg',
    '/logo_rubrion_ver4.png',
  ];
  
  criticalResources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.svg') || resource.endsWith('.png') ? 'image' : 'fetch';
    document.head.appendChild(link);
  });
};

// Reduce layout shifts by setting image dimensions
export const preventLayoutShifts = () => {
  const images = document.querySelectorAll('img:not([width]):not([height])');
  images.forEach((img) => {
    img.addEventListener('load', function(this: HTMLImageElement) {
      if (!this.width || !this.height) {
        this.style.aspectRatio = `${this.naturalWidth} / ${this.naturalHeight}`;
      }
    });
  });
};

// Initialize all optimizations
export const initPerformanceOptimizations = () => {
  // Run immediately
  preloadCriticalResources();
  
  // Run after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeImages();
      preventLayoutShifts();
    });
  } else {
    optimizeImages();
    preventLayoutShifts();
  }
  
  // Initialize Web Vitals measurement
  initWebVitals();
};

// Export for manual usage
export { measureLCP, measureFID, measureCLS, measureFCP, measureTTFB };
