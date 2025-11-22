/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['stream.mux.com', 'image.mux.com', 'i.ytimg.com', 'www.youtube.com'],
  },
  // Enable for OBS browser source transparency
  experimental: {
    optimizeCss: false,
  },
}

module.exports = nextConfig
