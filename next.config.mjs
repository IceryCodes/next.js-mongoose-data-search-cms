/** @type {import('next').NextConfig} */
const baseUrl = "https://";
const baseUrlDev = `http://localhost:${process.env.PORT || 3000}`;
const usedUrl = process.env.NODE_ENV === 'production' ? baseUrl : baseUrlDev

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mtmptech.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
    env: {
        NEXT_PRIVATE_API_BASE_URL: `${usedUrl}/api`,
        NEXT_PRIVATE_GOOGLE_API_URL: "AIzaSyDK_C6AbL3D_p7dgXugLBmHG-2YfndyiVM",

        NEXT_PUBLIC_BASE_URL: usedUrl,
        NEXT_PUBLIC_SITE_NAME: "MtM+ Technology",
        NEXT_PUBLIC_FEATURED_IMAGE: "https://mtmptech.com/wp-content/uploads/2022/07/logo_1280x720.jpg",
    }
};

export default nextConfig;
