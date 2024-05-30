/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [process.env.NEXT_PUBLIC_SUPABASE_URL.split("//")[1], "lh3.googleusercontent.com", "image.tmdb.org", "i.imgur.com", "imgur.com", "images.unsplash.com", "avatars.githubusercontent.com", "deeplake-uploads.s3.ap-northeast-1.amazonaws.com"],
    },
}

module.exports = nextConfig
