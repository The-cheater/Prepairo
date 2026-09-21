'use client';

import React, { useEffect, useState } from 'react';
import DotGrid from '@/frontend/components/react-bits/DotGrid';

export default function GlobalBackground() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    // Observe changes to html class
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.08] dark:opacity-[0.10] transition-opacity duration-300" 
      aria-hidden="true"
    >
      <DotGrid
        key={isDark ? 'dark-grid' : 'light-grid'}
        dotSize={3.5}
        gap={30}
        baseColor={isDark ? '#71717a' : '#a1a1aa'}
        activeColor={isDark ? '#ffffff' : '#09090b'}
        proximity={120}
        shockRadius={180}
        shockStrength={3}
        resistance={600}
        returnDuration={1.2}
      />
    </div>
  );
}
