/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['localhost', 'matteosalvatore.pe', 'res.cloudinary.com', 'supabase.co', 'images.unsplash.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pmugxoobcvuumymvopig.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
}

module.exports = nextConfig
