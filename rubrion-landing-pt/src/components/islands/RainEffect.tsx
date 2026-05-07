import { useEffect, useMemo, useRef, useState } from 'react';

export default function RainEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderRain, setRenderRain] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const rainCount = useMemo(() => {
    if (typeof window === 'undefined') return 30;
    return window.matchMedia('(max-width: 768px)').matches ? 10 : 30;
  }, []);

  const rainLines = useMemo(
    () =>
      Array.from({ length: rainCount }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 1 + Math.random() * 2,
      })),
    [rainCount]
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(entry?.isIntersecting ?? false);
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView) {
      setRenderRain(true);
      return;
    }
    const id = window.setTimeout(() => setRenderRain(false), 500);
    return () => window.clearTimeout(id);
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 space-rain"
      style={{ minHeight: '200vh' }}
      aria-hidden="true"
    >
      {renderRain &&
        rainLines.map((line, i) => (
          <div
            key={i}
            className="rain-line"
            style={{
              left: `${line.left}%`,
              animationDelay: `${line.delay}s`,
              animationDuration: `${line.duration}s`,
            }}
          />
        ))}
    </div>
  );
}
