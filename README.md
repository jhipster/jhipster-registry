# JHipster Registry

[![Build Status][github-actions-build]][github-actions-url] [![Docker Pulls](https://img.shields.io/docker/pulls/jhipster/jhipster-registry.svg)](https://hub.docker.com/r/jhipster/jhipster-registry/)

This is the [JHipster](https://www.jhipster.tech/) registry service, based on [Spring Cloud Netflix](https://cloud.spring.io/spring-cloud-netflix/), [Eureka](https://github.com/Netflix/eureka) and [Spring Cloud Config](https://cloud.spring.io/spring-cloud-config/).

Full documentation is available on the [JHipster documentation for microservices](https://www.jhipster.tech/microservices-architecture).

## Running locally

To run the cloned repository;

- For development run `./mvnw -Pdev,webapp` to just start in development or run `./mvnw` and run `npm install && npm start` for hot reload of client side code.
- For production profile run `./mvnw -Pprod`

[github-actions-build]: https://github.com/jhipster/jhipster-registry/workflows/Build/badge.svg
[github-actions-docker]: https://github.com/jhipster/jhipster-registry/workflows/Docker%20Image/badge.svg

## Discovery backends

The Registry uses its embedded Eureka server by default. Consul and Kubernetes are also supported, so that the
Registry UI can be used when the applications are not registered in Eureka. The discovery backend in use is
configured with the `application.discovery.backend` property and can be selected with a Spring profile:

- `eureka` (default) is the embedded Eureka server, started by the Registry itself.
- `consul` uses the [Spring Cloud Consul](https://docs.spring.io/spring-cloud-consul/docs/current/reference/html/) discovery client.
- `kubernetes` uses the [Spring Cloud Kubernetes](https://docs.spring.io/spring-cloud-kubernetes/docs/current/reference/html/) discovery client.

The Discovery clients of both backends are dependencies of the Registry, but they are disabled unless their profile is
active: running the Registry in Eureka mode does not require a Consul agent or a Kubernetes cluster. These defaults are
set in `bootstrap.yml`, as the Registry also loads its configuration through the bootstrap context of its Config Server,
which takes precedence over the properties of the `application-<profile>.yml` files.

### Consul

- Start the Registry with the `consul` profile, for example `SPRING_PROFILES_ACTIVE=dev,consul,native ./mvnw` or
  `SPRING_PROFILES_ACTIVE=prod,consul java -jar jhipster-registry.jar`.
- The Registry connects to the Consul agent running on `localhost:8500` and registers itself in Consul with a health
  check on its `/management/health` endpoint. Use the standard `spring.cloud.consul.*` properties to connect to
  another agent:

```yaml
spring:
  cloud:
    consul:
      host: consul.example.com
      port: 8500
```

- The Registry UI lists the applications registered in Consul, with the instances passing their health checks. Both the
  application name and the instance ID are the ones of Consul.
- The Eureka server is not started, so the `/api/eureka/*` endpoints and the Eureka screens (History, Replicas) are not
  available.

### Kubernetes

- Start the Registry with the `kubernetes` profile, for example `SPRING_PROFILES_ACTIVE=prod,kubernetes java -jar jhipster-registry.jar`.
- The Registry connects to the Kubernetes API with the service account of its pod and lists the services and the ready
  endpoints of its namespace. It therefore requires `get`, `list` and `watch` permissions on services and endpoints, for
  example with:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: jhipster-registry
rules:
  - apiGroups: ['']
    resources: ['services', 'endpoints']
    verbs: ['get', 'list', 'watch']
```

- The Registry UI lists the services of the namespace, with their ready endpoints. The application name is the name of
  the service and the instance ID is the UID of the pod.
- The labels and annotations of the services can be displayed in the Registry UI by enabling the metadata of the
  discovery client:

```yaml
spring:
  cloud:
    kubernetes:
      discovery:
        metadata:
          add-labels: true
          add-annotations: true
```

- When an application registers several ports, `spring.cloud.kubernetes.discovery.primary-port-name` selects the port
  used by the Registry.
- The Eureka server is not started, so the `/api/eureka/*` endpoints and the Eureka screens (History, Replicas) are not
  available.

### Registry API

Whatever the backend, the applications displayed in the Registry UI are provided by `GET /api/applications`:

```json
{
  "backend": "consul",
  "applications": [
    {
      "name": "jhipsterSampleMicroservice",
      "instances": [
        {
          "instanceId": "jhipsterSampleMicroservice:1",
          "homePageUrl": "http://localhost:8081",
          "healthCheckUrl": "http://localhost:8081/management/health",
          "statusPageUrl": "http://localhost:8081/management/info",
          "status": "UP",
          "metadata": {}
        }
      ]
    }
  ]
}
```

With the Eureka backend, the same applications are also available on the `GET /api/eureka/applications` endpoint. With
the Consul and Kubernetes backends, the management URLs of an instance are built from its address and can be overridden
with the `homePageUrl`, `healthCheckUrl` and `statusPageUrl` entries of the instance metadata.

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
