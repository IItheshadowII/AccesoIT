/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Excluir módulos de Node.js que no existen en el cliente
    config.resolve.fallback = {
      dns: false,
      fs: false,
      net: false,
      tls: false,
      pg: false,
      'pg-connection-string': false,
      pgpass: false
    };

    // Configurar alias para los módulos de Node.js
    config.resolve.alias = {
      ...config.resolve.alias,
      'pg': 'pg-browser',
      'pg-connection-string': 'pg-connection-string-browser',
      'pgpass': 'pgpass-browser'
    };

    return config;
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['http://localhost:9002']
    },
    turbo: {
      enabled: true
    }
  },
  // Configurar rutas de API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
