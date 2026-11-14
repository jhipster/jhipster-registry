// Initializes and unseals a Vault that runs in server mode, and mounts the key-value store the registry reads.
// Prints the root token, which the registry and the tests need.
// Usage: node src/test/e2e/backends/init-vault-server.mjs [vault url]
const vaultUrl = process.argv[2] ?? 'http://localhost:8200';

async function vault(method, path, body, token) {
  const response = await fetch(`${vaultUrl}/v1/${path}`, {
    method,
    headers: token ? { 'X-Vault-Token': token } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`Vault answered ${response.status} to ${method} ${path}: ${await response.text()}`);
  }
  return response.status === 204 ? {} : response.json();
}

const { keys, root_token: rootToken } = await vault('POST', 'sys/init', { secret_shares: 1, secret_threshold: 1 });
await vault('POST', 'sys/unseal', { key: keys[0] });
// Development mode mounts this store by default, server mode does not
await vault('POST', 'sys/mounts/secret', { type: 'kv', options: { version: '2' } }, rootToken);

console.log(rootToken);
