// Creates what the Git over SSH tests need: a key pair for the registry, a host key for the Git server,
// a known_hosts file that makes the registry trust that server, and the repository the server offers.
// Usage: node src/test/e2e/git-ssh/create-ssh-setup.mjs [directory]
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'target/e2e-git-ssh');
const client = join(root, 'client');
const server = join(root, 'server');
const work = join(root, 'work');
const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: 'pipe' });
const git = (...args) => run('git', ['-c', 'user.name=e2e', '-c', 'user.email=e2e@localhost', ...args], work);

rmSync(root, { recursive: true, force: true });
for (const directory of [client, server, work, join(root, 'repo')]) {
  mkdirSync(directory, { recursive: true });
}

// The registry shows ~/.ssh/id_rsa.pub on its SSH screen, so its key is an RSA key with that name
run('ssh-keygen', ['-q', '-t', 'rsa', '-b', '4096', '-N', '', '-C', 'jhipster-registry-e2e', '-f', join(client, 'id_rsa')]);
run('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-C', 'git-server-e2e', '-f', join(server, 'ssh_host_ed25519_key')]);
copyFileSync(join(client, 'id_rsa.pub'), join(server, 'authorized_keys'));
const [type, key] = readFileSync(join(server, 'ssh_host_ed25519_key.pub'), 'utf8').split(' ');
// "git-server" is the name of the server in docker-compose.yml
writeFileSync(join(client, 'known_hosts'), `git-server ${type} ${key}\n`);

writeFileSync(
  join(work, 'application.yml'),
  `configserver:
  name: JHipster Registry config server
  status: Connected to the JHipster Registry config server, which reads Git over SSH!

# The registry reads its own configuration from the config server, so it needs the JWT secret from here
jhipster:
  security:
    authentication:
      jwt:
        base64-secret: bXktc2VjcmV0LWtleS13aGljaC1zaG91bGQtYmUtY2hhbmdlZC1pbi1wcm9kdWN0aW9uLWFuZC1iZS1iYXNlNjQtZW5jb2RlZAo=

e2e:
  source: git-ssh
`,
);
git('init', '--quiet', '--initial-branch=main');
git('add', '--all');
git('commit', '--quiet', '--message', 'Configuration');
run('git', ['clone', '--quiet', '--bare', work, join(root, 'repo', 'config.git')]);
rmSync(work, { recursive: true, force: true });

console.log(`Created the SSH keys and the repository in ${root}`);
