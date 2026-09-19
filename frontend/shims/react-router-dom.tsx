'use client';

import React from 'react';
import NextLink from 'next/link';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ to, href, children, ...props }, ref) => {
  const targetHref = to || href || '#';
  return (
    <NextLink ref={ref} href={targetHref} {...props}>
      {children}
    </NextLink>
  );
});

Link.displayName = 'RouterLinkBridge';
