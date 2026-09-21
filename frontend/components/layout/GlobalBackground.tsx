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
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20 dark:opacity-25 transition-opacity duration-300" 
      aria-hidden="true"
    >
      <DotGrid
        key={isDark ? 'dark-grid' : 'light-grid'}
        dotSize={4}
        gap={28}
        baseColor={isDark ? '#52525b' : '#a1a1aa'}
        activeColor={isDark ? '#ffffff' : '#09090b'}
        proximity={140}
        shockRadius={200}
        shockStrength={4}
        resistance={600}
        returnDuration={1.2}
      />
    </div>
  );
}
