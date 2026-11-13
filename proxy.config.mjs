const backendHost = '127.0.0.1';
const backendPort = 8761;

/**
 * @type {import('vite').CommonServerOptions['proxy']}
 */
export default {
  '^/(api|management|v3/api-docs)': {
    target: `http://${backendHost}:${backendPort}`,
    xfwd: true,
  },
};
