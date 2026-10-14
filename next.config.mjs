import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  outputFileTracingExcludes: {
    "**/*": ["./public/**/*"],
  },
  experimental: {
  },
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/coworking",
        destination: "/coworking-office-space",
        permanent: true,
      },
      {
        source: "/blog-details/:slug",
        destination: "/blogs/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
