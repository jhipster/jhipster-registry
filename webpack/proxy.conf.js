function setupProxy({ tls }) {
  const conf = [
    {
      context: ['/api', '/services', '/management', '/v3/api-docs', '/h2-console', '/auth', '/health', '/config'],
      target: `http${tls ? 's' : ''}://localhost:8761`,
      secure: false,
      changeOrigin: tls,
    },
  ];
  return conf;
}

module.exports = setupProxy;
