/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/articles",
        destination: "/twasi-al-haq",
        permanent: true,
      },
      {
        source: "/articles/:slug*",
        destination: "/twasi-al-haq/:slug*",
        permanent: true,
      },
      {
        source: "/notes",
        destination: "/lectures/notes",
        permanent: true,
      },
      {
        source: "/materials",
        destination: "/lectures/notes",
        permanent: true,
      },
      {
        source: "/lectures/materials",
        destination: "/lectures/notes",
        permanent: true,
      },
      {
        source: "/reading-list",
        destination: "/about/reading-list",
        permanent: true,
      },
      {
        source: "/bibliography",
        destination: "/about/reading-list",
        permanent: true,
      },
      {
        source: "/about/bibliography",
        destination: "/about/reading-list",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
