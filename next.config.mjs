/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/checkout',
    images: {
        domains: ['woo.nexgi.com', 'local.nexgi-woo'],
        unoptimized: true,
        // loader: 'default',
        // loader: 'custom',
        path: '/checkout',
    },
};

export default nextConfig;
