# Multi-Discovery Backend Support

This implementation adds support for multiple service discovery backends (Eureka, Consul, Kubernetes) to the JHipster Registry.

## Overview

The JHipster Registry now supports pluggable discovery backends through the `DiscoveryBackend` interface. This allows the registry UI to display services from:

- **Eureka** (default) — Netflix Eureka service discovery
- **Consul** — HashiCorp Consul (via Spring Cloud DiscoveryClient abstraction)
- **Kubernetes** — Kubernetes native service discovery (via Spring Cloud DiscoveryClient abstraction)

## Architecture

```
DiscoveryBackend (interface)
├── EurekaDiscoveryBackend   — Wraps existing Eureka functionality (EurekaServerContext)
├── ConsulDiscoveryBackend   — Uses Spring Cloud DiscoveryClient → Consul
└── KubernetesDiscoveryBackend — Uses Spring Cloud DiscoveryClient → K8s API

DiscoveryBackendSelector
  └── Selects active backend based on:
      1. Explicit application.discovery.backend property
      2. First active backend found
```

### Key Design Decision: Spring Cloud DiscoveryClient

Unlike the competing implementation that uses raw ConsulClient and KubernetesClient libraries, this implementation uses **Spring Cloud's `DiscoveryClient`** abstraction. This provides:

1. **Consistent interface** — all backends implement the same contract
2. **Future-proof** — new backends (Zookeeper, Nacos, etc.) automatically work
3. **Spring-managed** — health checks, auto-configuration, properties binding
4. **Testable** — DiscoveryClient can be mocked/stubbed easily

## Usage

### Default (Eureka)

No configuration needed. The registry works as before with Eureka.

```bash
java -jar jhipster-registry.jar
```

### Consul Profile

```bash
java -jar jhipster-registry.jar --spring.profiles.active=consul
```

Requires `spring-cloud-starter-consul-discovery` on the classpath and a Consul agent.

### Kubernetes Profile

```bash
java -jar jhipster-registry.jar --spring.profiles.active=kubernetes
```

Requires `spring-cloud-starter-kubernetes-fabric8-all` on the classpath and
a Kubernetes environment with service account permissions.

## API Endpoints

### Unified Discovery API

| Endpoint | Description |
|----------|-------------|
| `GET /api/discovery/backend` | Get active backend name |
| `GET /api/discovery/backends` | List all available backends |
| `GET /api/discovery/applications` | Get registered applications |
| `GET /api/discovery/status` | Get backend status |
| `GET /api/discovery/replicas` | Get replica/peer addresses |
| `GET /api/discovery/history` | Get registration event history |

### Legacy Eureka API (Backward Compatible)

| Endpoint | Description |
|----------|-------------|
| `GET /api/eureka/applications` | Eureka applications |
| `GET /api/eureka/status` | Eureka status |
| `GET /api/eureka/replicas` | Eureka replicas |
| `GET /api/eureka/lastn` | Registration history |

## Configuration

Set preferred backend in `application.yml`:

```yaml
application:
  discovery:
    backend: eureka  # or consul, kubernetes
```

If not specified, the first active backend is used automatically.

## Dependencies

The Consul and Kubernetes backends are optional dependencies:

```xml
<!-- Consul support (optional) -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-consul-discovery</artifactId>
    <optional>true</optional>
</dependency>

<!-- Kubernetes support (optional) -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-kubernetes-fabric8-all</artifactId>
    <version>2.1.8</version>
    <optional>true</optional>
</dependency>
```

## Frontend Changes

The Angular frontend now uses the unified discovery API:

- `DiscoveryStatusService` — Fetches status from the active backend via `/api/discovery/status`
- `ApplicationsService` — Fetches applications from the active backend via `/api/discovery/applications`
- Backend name displayed in the UI header badge

## Testing

```bash
# Run unit tests
./mvnw test -Dtest="*DiscoveryBackend*,*DiscoveryResource*"

# Run all tests
./mvnw test
```

## Related Issue

Closes #320 — Support additional discovery and configuration systems (Consul & Kubernetes)
