// Mobile viewport adjustments for better mobile UX
export const useMobileViewport = () => {
  useEffect(() => {
    // Handle viewport height changes on mobile (keyboard appearance)
    const handleResize = () => {
      // Update CSS custom property for viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial value
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
};
