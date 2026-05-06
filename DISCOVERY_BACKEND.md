# Multi-Discovery Backend Support

This implementation adds support for multiple service discovery backends (Eureka, Consul, Kubernetes) to the JHipster Registry.

## Overview

The JHipster Registry now supports pluggable discovery backends through the `DiscoveryBackend` interface. This allows the registry UI to display services from:

- **Eureka** (default) - Netflix Eureka service discovery
- **Consul** - HashiCorp Consul service mesh
- **Kubernetes** - Kubernetes native service discovery

## Architecture

```
DiscoveryBackend (interface)
├── EurekaDiscoveryBackend   - Wraps existing Eureka functionality
├── ConsulDiscoveryBackend   - Connects to Consul agent
└── KubernetesDiscoveryBackend - Uses Kubernetes API
```

## Usage

### Default (Eureka)

No configuration needed. The registry works as before with Eureka.

### Consul Profile

```bash
java -jar jhipster-registry.jar --spring.profiles.active=consul
```

Required configuration in `application-consul.yml`:
```yaml
spring:
  cloud:
    consul:
      host: localhost
      port: 8500
      discovery:
        enabled: true
```

### Kubernetes Profile

```bash
java -jar jhipster-registry.jar --spring.profiles.active=kubernetes
```

Required configuration in `application-kubernetes.yml`:
```yaml
spring:
  cloud:
    kubernetes:
      namespace: default
      discovery:
        enabled: true
```

## API Endpoints

### Unified Discovery API

| Endpoint | Description |
|----------|-------------|
| `GET /api/discovery/backend` | Get active backend name |
| `GET /api/discovery/backends` | List all available backends |
| `GET /api/discovery/applications` | Get registered applications |
| `GET /api/discovery/status` | Get backend status |
| `GET /api/discovery/replicas` | Get replica/peer addresses |

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
    <optional>true</optional>
</dependency>
```

## Frontend Changes

The Angular frontend now uses the unified discovery API:

- `DiscoveryStatusService` - Fetches status from active backend
- `ApplicationsService` - Fetches applications from active backend
- Backend name displayed in UI header badge

## Related Issue

Closes #320 - Support additional discovery and configuration systems (Consul & Kubernetes)
