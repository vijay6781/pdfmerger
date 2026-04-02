/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for free Vercel/Netlify deploy
  // output: 'export', // Uncomment if you want pure static export

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
  },

  // Compress output
  compress: true,

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Redirects for SEO (old URLs → new)
  async redirects() {
    return [
      {
        source: "/merge-pdf",
        destination: "/tools/pdf-merger",
        permanent: true,
      },
      {
        source: "/split-pdf",
        destination: "/tools/pdf-splitter",
        permanent: true,
      },
      {
        source: "/convert-image",
        destination: "/tools/image-converter",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
