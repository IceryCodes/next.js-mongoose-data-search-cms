/** @type {import('next').NextConfig} */
const baseUrl = process.env.BASE_URL;
const baseUrlDev = `http://localhost:${process.env.PORT}`;
const usedUrl = process.env.NODE_ENV === 'production' ? baseUrl : baseUrlDev

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
    env: {
        NEXT_PRIVATE_MONGODB_URI: process.env.MONGODB_URI,
        NEXT_PRIVATE_JWT_SECRET: process.env.JWT_SECRET,
        NEXT_PRIVATE_EMAIL_USER: process.env.EMAIL_USER,
        NEXT_PRIVATE_EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
        NEXT_PRIVATE_ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        NEXT_PRIVATE_REQUESTS_LIMIT: process.env.REQUESTS_LIMIT,

        NEXT_PUBLIC_BASE_URL: usedUrl,
        NEXT_PUBLIC_API_BASE_URL: `${usedUrl}/api`,
        NEXT_PUBLIC_SITE_NAME: process.env.SITE_NAME,
        NEXT_PUBLIC_FEATURED_IMAGE: "/assets/featured_image.jpg",
        NEXT_PUBLIC_GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
    }
};

export default nextConfig;
