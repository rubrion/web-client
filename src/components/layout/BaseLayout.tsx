import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef } from 'react';
import { initializeScrollSystem, destroyScrollSystem } from '../../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

interface BaseLayoutProps {
    children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Inicializar sistema de scroll integrado
        initializeScrollSystem();

        const ctx = gsap.context(() => {
            // Configurações globais para animações responsivas
            ScrollTrigger.config({
                autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
                ignoreMobileResize: true
            });

            // Refresh ScrollTrigger em mudanças de viewport
            const handleResize = () => {
                ScrollTrigger.refresh();
            };

            // Handle mobile orientation change
            const handleOrientationChange = () => {
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 100);
            };

            window.addEventListener('resize', handleResize);
            window.addEventListener('orientationchange', handleOrientationChange);

            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('orientationchange', handleOrientationChange);
            };
        }, containerRef);

        // Prevent scroll restoration on page reload
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        return () => {
            ctx.revert();
            destroyScrollSystem();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full overflow-x-hidden bg-surface-base text-text-primary"
            style={{
                // Garante que o container nunca exceda a largura da viewport
                maxWidth: '100vw',
                position: 'relative',
                // Mobile scroll optimization
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain'
            }}
        >
            {children}
        </div>
    );
};

export default BaseLayout;
