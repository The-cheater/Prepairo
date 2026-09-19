'use client';

import React from 'react';
import DotGrid from '@/frontend/components/react-bits/DotGrid';

export default function GlobalBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25" 
      aria-hidden="true"
    >
      <DotGrid
        dotSize={4}
        gap={28}
        baseColor="#71717a"
        activeColor="#09090b"
        proximity={140}
        shockRadius={200}
        shockStrength={4}
        resistance={600}
        returnDuration={1.2}
      />
    </div>
  );
}
