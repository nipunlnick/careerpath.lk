/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // GEMINI_API_KEY should be server-side only
  },
};

export default nextConfig;
