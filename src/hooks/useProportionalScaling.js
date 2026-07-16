import { useEffect } from 'react';

/**
 * Custom hook to scale the entire web page layout proportionally,
 * matching the visual output of a baseline design width.
 */
export default function useProportionalScaling() {
  useEffect(() => {
    const rootEl = document.getElementById('root');
    if (!rootEl) return;

    const handleResize = () => {
      const width = window.innerWidth;
      
      // Determine device mode using the same breakpoint as deviceDetection.js (768px)
      if (width < 768) {
        // Mobile Layout: Base design width is 375px
        const baseMobileWidth = 375;
        // Limit scaling factor to prevent extreme zoom-out on very tiny screens
        const scale = Math.max(0.8, width / baseMobileWidth);
        rootEl.style.zoom = scale;
      } else {
        // Desktop Layout: Base design width is 1440px
        const baseDesktopWidth = 1440;
        // Scale up only on high-res monitors (> 1440px) like 4K
        // For standard laptop/desktop monitors (768px to 1440px), keep normal size (zoom = 1.0)
        if (width > baseDesktopWidth) {
          const scale = width / baseDesktopWidth;
          rootEl.style.zoom = scale;
        } else {
          rootEl.style.zoom = 1.0;
        }
      }
    };

    // Initialize layout scaling immediately
    handleResize();

    window.addEventListener('resize', handleResize);
    
    // Clean up event listener and restore default zoom on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      rootEl.style.zoom = '';
    };
  }, []);
}
