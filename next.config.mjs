/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "bcrypt": false,
      "fs": false,
      "net": false,
      "tls": false,
    }
    return config
  },
  // Añadimos configuración específica para desarrollo
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  }
}

export default nextConfig