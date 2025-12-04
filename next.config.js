/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [' SpaFort.zenoti.com', 'res.cloudinary.com'], // Add Cloudinary domain for uploaded images
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
}

// Force port for development
if (process.env.NODE_ENV === 'development') {
  process.env.PORT = '3002';
}

export default nextConfig