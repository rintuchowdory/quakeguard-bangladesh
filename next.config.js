/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/quakeguard-bangladesh' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/quakeguard-bangladesh/' : '',
}

module.exports = nextConfig
