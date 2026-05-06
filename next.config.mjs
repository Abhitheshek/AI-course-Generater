/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['img.youtube.com', 'i.ytimg.com'],
    },
    experimental: {
        optimizePackageImports: ['@google/generative-ai']
    },
    // Disable turbopack for development to avoid font issues
    ...(process.env.NODE_ENV === 'development' && {
        turbo: false
    })
};

export default nextConfig;
