/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [' SpaFort.zenoti.com', 'res.cloudinary.com'], // Add Cloudinary domain for uploaded images
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
}

export default nextConfig