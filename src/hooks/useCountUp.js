import { useState, useEffect } from 'react';

export function useCountUp(targetValue, duration = 800, delay = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(targetValue);
      return;
    }

    let startTime = null;
    let animationFrameId = null;
    let timerId = null;

    const startAnimation = () => {
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Ease-out cubic: 1 - Math.pow(1 - progress, 3)
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.round(easeOutProgress * targetValue);
        
        setCount(currentCount);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setCount(targetValue);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    };

    if (delay > 0) {
      timerId = setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }

    return () => {
      if (timerId) clearTimeout(timerId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, duration, delay]);

  return count;
}
