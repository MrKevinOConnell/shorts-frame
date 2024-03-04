/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
  },
};

export default nextConfig;
