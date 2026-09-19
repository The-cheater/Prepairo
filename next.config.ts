import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "gsap/InertiaPlugin": "./frontend/shims/gsap-inertia.ts",
      "gsap/SplitText": "./frontend/shims/gsap-split-text.ts",
      "react-router-dom": "./frontend/shims/react-router-dom.tsx",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "gsap/InertiaPlugin": path.resolve(__dirname, "frontend/shims/gsap-inertia.ts"),
      "gsap/SplitText": path.resolve(__dirname, "frontend/shims/gsap-split-text.ts"),
      "react-router-dom": path.resolve(__dirname, "frontend/shims/react-router-dom.tsx"),
    };
    return config;
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl.replace(/\/$/, '')}/:path*`,
      },
    ];
  },
};

export default nextConfig;
