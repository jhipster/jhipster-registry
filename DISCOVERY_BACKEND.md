# Discovery Backend Configuration

JHipster Registry supports multiple service discovery backends:

## Eureka (Default)

No additional configuration needed. Eureka is the default backend.

```yaml
application:
  discovery:
    backend: eureka
```

## Consul

Run with the `consul` Spring profile:

```bash
java -jar jhipster-registry.jar --spring.profiles.active=consul
```

Or configure manually:

```yaml
application:
  discovery:
    backend: consul
  consul:
    host: localhost
    port: 8500
```

### Consul Dependencies

The Consul client is included when the `consul` profile is active. Make sure Consul agent is running:

```bash
consul agent -dev
```

## Kubernetes

Run with the `kubernetes` Spring profile:

```bash
java -jar jhipster-registry.jar --spring.profiles.active=kubernetes
```

Or configure manually:

```yaml
application:
  discovery:
    backend: kubernetes
  kubernetes:
    namespace: default
```

### Kubernetes Requirements

- The registry must be running inside a Kubernetes cluster
- ServiceAccount with appropriate RBAC permissions is required
- The Kubernetes Java client is included when the `kubernetes` profile is active

## API Endpoints

All discovery backends expose the same API:

| Endpoint | Description |
|----------|-------------|
| `GET /api/discovery/applications` | List all registered applications |
| `GET /api/discovery/status` | Get discovery backend status |
| `GET /api/discovery/replicas` | List replica nodes |
| `GET /api/discovery/lastn` | Get recent registrations/cancellations |
| `GET /api/discovery/backend` | Get current backend type |

Legacy Eureka endpoints (`/api/eureka/*`) continue to work and delegate to the active discovery backend.
