import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "*.gstatic.com" },
      { protocol: "https", hostname: "books.google.com" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "ia800100.us.archive.org" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
