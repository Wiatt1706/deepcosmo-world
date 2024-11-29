/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [process.env.NEXT_PUBLIC_SUPABASE_URL.split("//")[1], "lh3.googleusercontent.com", "image.tmdb.org", "images.unsplash.com", "avatars.githubusercontent.com"],
    },
}

module.exports = nextConfig
