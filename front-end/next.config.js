/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    domains: ["airneis-bucket.s3.eu-west-3.amazonaws.com"],
  },
}

module.exports = nextConfig
