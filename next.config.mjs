/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // Limit file tracing to the project root to avoid Windows protected folders
  outputFileTracingRoot: process.cwd(),
  // Exclude Windows user profile junction that triggers EPERM during glob/scandir
  outputFileTracingExcludes: {
    '*': [
      '**/Application Data/**',
      'C:/Users/**/Application Data/**',
      'C\\\\Users\\\\**\\\\Application Data\\\\**',
    ],
  },
}

export default nextConfig
