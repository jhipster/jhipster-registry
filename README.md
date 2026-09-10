# JHipster Registry

[![Build Status][github-actions-build]][github-actions-url] [![Docker Pulls](https://img.shields.io/docker/pulls/jhipster/jhipster-registry.svg)](https://hub.docker.com/r/jhipster/jhipster-registry/)

This is the [JHipster](https://www.jhipster.tech/) registry service, based on [Spring Cloud Netflix](https://cloud.spring.io/spring-cloud-netflix/), [Eureka](https://github.com/Netflix/eureka) and [Spring Cloud Config](https://cloud.spring.io/spring-cloud-config/).

Full documentation is available on the [JHipster documentation for microservices](https://www.jhipster.tech/microservices-architecture).

## Running locally

To run the cloned repository;

- For development run `./mvnw -Pdev,webapp` to just start in development or run `./mvnw` and run `npm install && npm start` for hot reload of client side code.
- For production profile run `./mvnw -Pprod`

## Viewing services without Eureka

The Registry can use Spring Cloud's Consul or Kubernetes discovery client to populate its existing UI. Eureka remains the default. An external discovery profile disables the embedded Eureka server and its client; it does not change authentication or Spring Cloud Config's configuration sources.

Build with the matching Maven profile to include the optional client, and select the matching Spring profile when starting the application:

```shell
# Consul: connect to a local agent; use spring.cloud.consul.host/port for another address.
SPRING_PROFILES_ACTIVE=dev,consul ./mvnw -Pdev,webapp,consul

# Kubernetes: use the namespace and API credentials configured for the Fabric8 client.
SPRING_PROFILES_ACTIVE=dev,kubernetes ./mvnw -Pdev,webapp,kubernetes
```

Keep the existing configuration-server setup (native files, Git, or Vault) appropriate for your environment. These profiles do not turn Consul KV, Kubernetes ConfigMaps, or Secrets into configuration repositories. Consul registration is disabled: this Registry reads the catalog. Kubernetes discovery reads Services and Endpoints in the client's configured namespace; provide a service account or kubeconfig with permission to get/list those resources. No cluster or cloud account is created by the application. Only one discovery profile may be active. Selecting one without its Maven dependency fails at startup rather than displaying an empty Eureka catalog.

The Applications and Home pages preserve the existing instance fields. External instance IDs are opaque, so Config uses the discovered service name. Links use the instance URI, optional `context-path` and `management.context-path` metadata (default `/management`), or explicit `homePageUrl`, `healthCheckUrl`, and `statusPageUrl` metadata. Explicit URLs support separate management hosts/ports. `UNKNOWN` is shown neutrally because the portable discovery API does not provide a per-instance health status. System Status and General Info describe the Registry JVM. Eureka lease histories and peer replicas remain empty for external providers; those providers manage their own history and topology.

### Testing discovery profiles

The normal Java and frontend suites cover payload mapping, empty catalogs, opaque IDs, health presentation, and profile selection. The optional-client test starts the real application and each real Spring discovery client against an in-process HTTP fixture; it does not require a running Consul agent or Kubernetes cluster:

```shell
./mvnw -Pdev,consul -Dskip.installnodenpm -Dskip.npm -Dtest=ProviderApplicationIT -Ddiscovery.test.provider=consul test
./mvnw -Pdev,kubernetes -Dskip.installnodenpm -Dskip.npm -Dtest=ProviderApplicationIT -Ddiscovery.test.provider=kubernetes test
# Both optional dependencies present, neither selected: preserve embedded Eureka.
./mvnw -Pdev,consul,kubernetes -Dskip.installnodenpm -Dskip.npm -Dtest=ProviderApplicationIT -Ddiscovery.test.provider=eureka test
```

These explicit checks also run as separate CI commands. `ProviderApplicationIT` is intentionally opt-in because closing an embedded Eureka context shuts down Servo's process-wide scheduler; it must not run before the existing integration tests in their shared JVM. The existing suite runs normally.

The tests load the built production bootstrap files and select profiles through command-line arguments. Only discovery API addresses, local credentials discovery, catalog polling, and config-server bootstrap traffic are isolated for the fixture. They assert the actual client type, the absence/presence of Eureka, all four `/api/eureka/*` UI endpoints, and read-only discovery requests. They do not verify live-cluster RBAC/networking or browser behavior.

[github-actions-build]: https://github.com/jhipster/jhipster-registry/workflows/Build/badge.svg
[github-actions-docker]: https://github.com/jhipster/jhipster-registry/workflows/Docker%20Image/badge.svg

## HashiCorp Vault Integration

### Development Mode

`JHipster Registry` default integration uses a `vault` server with an in-memory backend. The data shall not be persist and shall require you to configure secrets after every restart. The in-memory configuration provides an easy way to test out the integration and later switch to the recommended server mode.

- Start vault server docker container:

```shell
docker-compose -f src/main/docker/vault.yml up -d
```

- The default configured root token is `jhipster-registry`. We shall use the default secrets engine backend mounted on the `secrets` path. Configure secrets using either of `ui`, `cli` or `http`.
- Create a new secret sub-path `jhipster-registry/dev` and add the following secret in JSON format. Here `jhipster-registry` refers to the application name and `dev` refers to the development profile. Do follow the same convention to configure secrets of other applications.

```json
{
  "spring.security.user.password": "admin123!"
}
```

- Start `JHipster Registry` server in development mode using the following command (skipping execution of test cases):

```shell
./mvnw -DskipTests
```

- After successful start, open `http://localhost:8761/` in a browser. You shall require entering a new password as provided in the above vault configuration.

### Server Mode

`JHipster Registry` also provides configuration to use the native file system as the persistent backend.

- Uncomment the following configurations in [vault.yml](src/main/docker/vault.yml). You can refer [config.hcl](src/main/docker/vault-config/config/config.hcl) to view provided vault server configurations:

```yml
command: server
volumes:
  - ./vault-config/config:/vault/config
  - ./vault-config/logs:/vault/logs
  - ./vault-config/data:/vault/file
```

- Start vault server docker container:

```shell
docker-compose -f src/main/docker/vault.yml up -d
```

- Open `vault` server [`ui`](http://localhost:8200/ui/vault/init) to initialize master key shares. In this guide, we shall enter `1` as the number of key shares and `1` as the key threshold value. Do refer to vault documentation for recommended configuration. Note down the initial `root token` and the `key` and keep it at a safe place. You shall require the `key` to unseal the vault server after a restart.
- Enable secret engine backend `kv` and use `secret` as the mount path.
- Create a new secret sub-path `jhipster-registry/dev` and add the following secrets in JSON format. Here `jhipster-registry` refers to the application name and `dev` refers to the development profile. Do follow the same convention to configure secrets of other applications.

```json
{
  "spring.security.user.password": "admin123!"
}
```

- In this guide, we shall use the `token` authentication mechanism to retrieve secrets from the `vault` server. Update `bootstrap.yml` to specify `root token` in place of default dev token.

```yaml
vault:
  authentication: token
  token: jhipster-registry # In server mode, provide a token having read access on secrets
```

- Start `JHipster Registry` server in development mode using the following command (skipping execution of test cases):

```shell
./mvnw -DskipTests
```

- After successful start, you shall require entering a new password as provided in vault.

## OAuth 2.0 and OpenID Connect

OAuth is a stateful security mechanism, like HTTP Session. Spring Security provides excellent OAuth 2.0 and OIDC support, and this is leveraged by JHipster. If you’re not sure what OAuth and OpenID Connect (OIDC) are, please see [What the Heck is OAuth?](https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth)

Please note that [JSON Web Token (JWT)](https://jwt.io/) is the default option when using the JHipster Registry. It has to be started with **oauth2** spring profile to enable the OAuth authentication.

In order to run your JHipster Registry with OAuth 2.0 and OpenID Connect:

- For development run `SPRING_PROFILES_ACTIVE=dev,oauth2,native ./mvnw`
- For production you can use environment variables. For example:

```
export SPRING_PROFILES_ACTIVE=prod,oauth2,api-docs
```

### Keycloak

[Keycloak](https://www.keycloak.org/) is the default OpenID Connect server configured with JHipster.

If you want to use Keycloak, you can follow the [documentation for Keycloak](https://www.jhipster.tech/security/#keycloak)

### Okta

If you'd like to use [Okta](https://www.okta.com/) instead of Keycloak, you can follow the [documentation for Okta](https://www.jhipster.tech/security/#okta)

### Auth0

If you'd like to use [Auth0](https://auth0.com/) instead of Keycloak, you can follow the [documentation for Auth0](https://www.jhipster.tech/security/#auth0)

\*NOTE: Using the JHipster Registry, add URLs for port 8761 too ("Allowed Callback URLs" and "Allowed Logout URLs")
