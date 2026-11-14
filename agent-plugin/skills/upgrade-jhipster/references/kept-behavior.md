# Where the registry deliberately differs from the generated code

Each item is something the generator's output does differently and the registry keeps as it was, with the reason. After a merge, check that each one still holds. Add to this list when an upgrade finds a new one, and remove an item when the generator catches up.

## Server

- **Eureka answers 404 for unknown instances.** Both security configurations permit the error dispatch (`dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()`). Without it Spring Security turns every 404 from Eureka into a 403, and an application registers again only when its heartbeat gets a 404. `EurekaServerIT` tests it.
- **HTTP Basic stays enabled** next to JWT and OAuth2. Applications register with Eureka and read their configuration with it.
- **`/eureka/**`, `/config/**` and `/api/**` need the administrator role**, apart from signing in and reading the account. So does `/management/prometheus`, which the generator makes public.
- **The plain `jhipster.security.authentication.jwt.secret` property works when `base64-secret` is not set.** The default production configuration repository, `jhipster-registry-sample-config`, only sets `secret`. `SecurityJwtConfigurationTest` tests it.
- **Authorities are read from tokens whether they are separated by commas or spaces**, so tokens of a release before 8.0.0 stay valid. Authentication factors (`FACTOR_*`) are left out of tokens and of `/api/account`. `SecurityConfigurationIT` tests both.
- **With the `oauth2` profile, unauthenticated requests get a 401**, not a redirect to the identity provider. The client starts the sign-in itself. `OAuth2SecurityConfigurationIT` tests it.
- **`SpaWebFilter` skips `/eureka`, `/config`, `/oauth2` and `/login/oauth2`**, and forwards `/login` to the client. `SpaWebFilterIT` tests it.
- **CORS is registered for `/config/**` and `/eureka/**`** in `WebConfigurer`.
- **`logstash-logback-encoder` is a dependency**, at the version jhipster-framework is built with. The generator leaves it out, and JSON and Logstash logging fail without it. The test configuration logs in JSON so that a missing class fails the tests.
- **`logback-spring.xml` includes Spring Boot's `base.xml`**, which logs to a file, so that the `logfile` endpoint works.
- **The `zipkin` Maven profile uses `spring-boot-starter-zipkin`.**
- **The `docker-compose` Maven profile is removed.** The registry needs no other service to start, and the profile makes it fail without a compose file.
- **The Docker image is built for amd64 and arm64 and is named `jhipster-registry`.**
- **The mail and MapStruct dependencies are removed.** Nothing uses them.
- **`EurekaResource.lastn` lists leases that share a timestamp together.**

## Client

- **The dev server proxies `/config`** (`proxy.config.mjs`), which the Cloud config and Encryption screens call.
- **The auth-expired interceptor only handles the first 401 of a signed-in user.**
- **Asset URLs in `index.html`, `loading.css` and `navbar.scss` are relative to the base**, for deployments under a context path.
- **`SignInService` decides how to sign in from the active profiles.** The home page, the navbar and the sign-in page use it.
- **The registry's screens live in `app/registry/`, and shared pieces in `app/shared/array/` and `app/shared/refresh/`.** `home/` and `layouts/navbar/` are generated files with the registry's content.
- **There is no `entities/` folder and no entity menu.**

## Docker Compose files and the rest

- **The Keycloak realm keeps the `internal` client**, which JHipster gateways and microservices sign in with. The generator only creates it for gateways.
- **Vault's compose file has a health check that accepts a sealed Vault**, and its server mode keeps data and logs in Docker volumes and lifts the limit on locked memory.
- **The Control Center starts with the `eureka` profile.**
- **`src/main/docker/app.yml` does not delay the start of the registry.**
- **The devcontainer uses `mcr.microsoft.com/devcontainers/java`.**
- **The Heroku files follow the released version named in `app.json`**, not the code on `main`.
