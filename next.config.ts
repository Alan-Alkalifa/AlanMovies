// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ❗️Abaikan error TypeScript saat build (tidak untuk production serius)
    ignoreBuildErrors: true,
  },
  eslint: {
    // ❗️Abaikan error ESLint saat build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
