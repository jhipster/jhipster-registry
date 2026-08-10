
function setupProxy({ tls }) {
  const conf = [
    {
      context: ['/api', '/services', '/management', '/v3/api-docs', '/h2-console', '/auth', '/health', '/config'],
      target: `http${tls ? 's' : ''}://localhost:8761`,
      secure: false,
      changeOrigin: tls,
    },
    {
      context: ['/consul'],
      target: 'http://localhost:8500',
      secure: false,
      changeOrigin: true,
      pathRewrite: { '^/consul': '' },
    },
    {
      context: ['/kubernetes'],
      target: 'http://localhost:8001',
      secure: false,
      changeOrigin: true,
      pathRewrite: { '^/kubernetes': '' },
    },
  ];
  return conf;
}

module.exports = setupProxy;
