function setupProxy() {
  const tls = process.env.TLS;
  const conf = [
    {
      context: ['/api', '/management', '/swagger-resources', '/v2/api-docs', '/v3/api-docs', '/h2-console', '/auth', '/health', '/config'],
      target: `http${tls ? 's' : ''}://localhost:8761`,
      secure: false,
      changeOrigin: tls,
    },
  ];
  return conf;
}

module.exports = setupProxy();
