/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: [
    'pdfkit',
    'fontkit',
    'linebreak',
    'unicode-properties',
    'brotli',
  ],
}

export default nextConfig
