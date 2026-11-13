# Syncing with generator-jhipster

JHipster Registry is generated with generator-jhipster.
The following is a base workflow to regenerate JHipster Registry using a new generator-jhipster release.

Update JHipster:

```
npm install generator-jhipster@latest --save-exact
```

Regenerate non-customized files using latest jhipster check changes and commit:

```
jhipster --prefer-local --skip-install
git commit -a -m 'Sync with jhipster@vX.X.X'
```

Regenerate customized files and check for required changes (eg: package.json, pom.xml):

```
jhipster --prefer-local --skip-yo-resolve --skip-install
```

Manually commit required changes and then cleanup changes:

```
git add selected_files
git diff --cached
git commit -m 'Manual sync with jhipster@vX.X.X'
git reset --hard
git clean -fd
```

Regenerate dependencies:

```
rm -rf node_modules package-lock.json target
./npmw install
git add package-lock.json
git commit -m "Regenerate dependencies"
```

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
