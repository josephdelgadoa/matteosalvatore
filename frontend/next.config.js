/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['localhost', 'matteosalvatore.pe', 'res.cloudinary.com', 'supabase.co', 'images.unsplash.com'],
    },
}

module.exports = nextConfig
