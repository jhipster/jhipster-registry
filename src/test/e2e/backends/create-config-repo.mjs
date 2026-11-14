// Creates the Git repository that the registry serves its configuration from in the config backend tests.
// Usage: node src/test/e2e/backends/create-config-repo.mjs [directory]
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = resolve(process.argv[2] ?? 'target/e2e-config-repo');
const git = (...args) => execFileSync('git', ['-c', 'user.name=e2e', '-c', 'user.email=e2e@localhost', ...args], { cwd: repo });

const configuration = source => `configserver:
  name: JHipster Registry config server
  status: Connected to the JHipster Registry config server, backed by Git!

# The registry reads its own configuration from the config server, so it needs the JWT secret from here
jhipster:
  security:
    authentication:
      jwt:
        base64-secret: bXktc2VjcmV0LWtleS13aGljaC1zaG91bGQtYmUtY2hhbmdlZC1pbi1wcm9kdWN0aW9uLWFuZC1iZS1iYXNlNjQtZW5jb2RlZAo=

e2e:
  source: ${source}
`;

rmSync(repo, { recursive: true, force: true });
mkdirSync(repo, { recursive: true });
git('init', '--quiet', '--initial-branch=main');

writeFileSync(join(repo, 'application.yml'), configuration('git-main'));
git('add', '--all');
git('commit', '--quiet', '--message', 'Configuration on main');

git('checkout', '--quiet', '-b', 'feature');
writeFileSync(join(repo, 'application.yml'), configuration('git-feature'));
git('commit', '--quiet', '--all', '--message', 'Configuration on feature');
git('checkout', '--quiet', 'main');

console.log(`Created the configuration repository in ${repo}`);
