# Syncing with generator-jhipster

JHipster Registry is generated with generator-jhipster, and then changed: it has its own screens and endpoints, and it changes some of the generated files.

The `jhipster_upgrade` branch holds the unmodified output of JHipster for the configuration in `.yo-rc.json`. To move to a new generator-jhipster release, regenerate on that branch and merge it into `main`. Git then merges what changed in the generator with what the registry changed, and only reports a conflict where both changed the same lines.

Regenerate on the `jhipster_upgrade` branch, where `X.X.X` is the new version:

```
git checkout jhipster_upgrade
git rm -rq .
git checkout HEAD -- .yo-rc.json
npx generator-jhipster@X.X.X --force --skip-install --skip-git
git checkout HEAD -- src/main/resources/config/tls/keystore.p12
git add --all
git commit -m "Generated with JHipster X.X.X"
```

The generator creates a new TLS keystore on every run, which is why the steps above keep the previous one.

Merge it on a branch from `main`, resolve the conflicts, and open a pull request:

```
git checkout -b jhipster-X.X.X main
git merge jhipster_upgrade
```

Then regenerate the dependencies, and run the build and the end-to-end tests described below:

```
rm -rf node_modules package-lock.json target
./npmw install
./mvnw verify
```

This only works while `jhipster_upgrade` is an ancestor of `main`, which is what tells Git which generated version the registry's code is based on. Check it with the following command, which prints nothing when all is well:

```
git merge-base --is-ancestor jhipster_upgrade main || echo "jhipster_upgrade is not an ancestor of main"
```

It stops being an ancestor when a pull request that merged it was squashed or rebased. To record it again without changing any file, run `git merge -s ours jhipster_upgrade` on `main` once the files on `main` are up to date with that generated version.

`.yo-resolve` lists the generated files the registry has changed. It only matters when JHipster runs directly in a checkout of `main`, where it leaves those files alone.

## With an AI assistant

The `agent-plugin` directory is an [Agent Plugins](https://agent-plugins.org/) package with a skill, `upgrade-jhipster`, that walks an AI coding assistant through these steps: the order, how to resolve the conflicts, and how to check that nothing the registry does was lost. Its list of the places where the registry deliberately differs from the generated code is in `agent-plugin/skills/upgrade-jhipster/references/kept-behavior.md`, and is worth reading before an upgrade by hand too.

Assistants that support Agent Plugins load the package from the `agent-plugin` directory. Claude Code finds the skill by itself through the link in `.claude/skills`. Any other assistant can be pointed at `agent-plugin/skills/upgrade-jhipster/SKILL.md`.

# End-to-end tests

The end-to-end tests in `src/test/e2e` use [Playwright](https://playwright.dev/) and run against a registry that is already started. After `./npmw install`, install the browser once with `./npmw exec playwright install chromium`, which uses the Playwright version of this project.

To test the default JWT authentication, start the registry and run the tests. The encryption tests need an encryption key, so set `ENCRYPT_KEY` to any value:

```
ENCRYPT_KEY=e2e-test-key ./mvnw
./npmw run e2e
```

The tests register and cancel instances of an application named `E2E-APP` through the Eureka REST API.

To test OAuth 2.0, start Keycloak and the registry with the `oauth2` profile, then run the tests:

```
docker compose -f src/main/docker/keycloak.yml up --wait
SPRING_PROFILES_ACTIVE=dev,oauth2 ./mvnw
./npmw run e2e:oauth2
```

To test peer replication, build the Docker image and start two registries that replicate to each other, then run the tests. Eureka needs each peer to have its own host name, which is why this runs in containers:

```
./npmw run java:docker
docker compose -f src/test/e2e/peers/docker-compose.yml up --wait
./npmw run e2e:peers
docker compose -f src/test/e2e/peers/docker-compose.yml down
```

To test the Git and Vault configuration backends, create the Git repository the tests use, start Vault, and start the registry with both as its configuration sources. Then run the tests:

```
./npmw run e2e:backends:repo
docker compose -f src/main/docker/vault.yml up --wait

export SPRING_CLOUD_CONFIG_SERVER_COMPOSITE_0_TYPE=git
export SPRING_CLOUD_CONFIG_SERVER_COMPOSITE_0_URI=file://$PWD/target/e2e-config-repo
export SPRING_CLOUD_CONFIG_SERVER_COMPOSITE_1_TYPE=vault
export SPRING_CLOUD_CONFIG_SERVER_COMPOSITE_1_KV_VERSION=2
export SPRING_CLOUD_CONFIG_SERVER_COMPOSITE_1_BACKEND=secret
export SPRING_CLOUD_CONFIG_SERVER_COMPOSITE_1_DEFAULT_KEY=application
export SPRING_CLOUD_CONFIG_SERVER_COMPOSITE_1_PROFILE_SEPARATOR=/
./mvnw

./npmw run e2e:backends
```

Both sources have to be set, because setting one of them through the environment replaces the whole list in `bootstrap.yml`. The tests commit to the repository in `target/e2e-config-repo` and write secrets to Vault.

The same tests run against Vault in server mode, which the README describes. Start Vault with the extra compose file, then initialize and unseal it. That prints the root token, which the registry and the tests need:

```
docker compose -f src/main/docker/vault.yml -f src/test/e2e/backends/vault-server.yml up --wait
export SPRING_CLOUD_CONFIG_SERVER_VAULT_TOKEN=$(node src/test/e2e/backends/init-vault-server.mjs)
export E2E_VAULT_TOKEN=$SPRING_CLOUD_CONFIG_SERVER_VAULT_TOKEN
```

Vault keeps its data in a Docker volume that the extra compose file declares. To start over, stop Vault with both files and `-v`:

```
docker compose -f src/main/docker/vault.yml -f src/test/e2e/backends/vault-server.yml down -v
```

To test the default production configuration, start the registry with the `prod` profile and nothing else configured. It then reads its configuration from [jhipster-registry-sample-config](https://github.com/jhipster/jhipster-registry-sample-config) on GitHub:

```
./mvnw -Pprod
./npmw run e2e:prod
```

The HTML report and the traces of failed tests are written to `target/playwright`.
