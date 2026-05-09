package tech.jhipster.registry.web.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.registry.config.ApplicationProperties;
import tech.jhipster.registry.service.discovery.DiscoveryBackend;
import tech.jhipster.registry.service.discovery.DiscoveryBackendSelector;

/**
 * Unified REST controller for viewing discovery backend data.
 * <p>
 * Works with Eureka, Consul, or Kubernetes depending on configuration.
 * This provides a consistent API that the frontend can use regardless of
 * which discovery backend is active.
 */
@RestController
@RequestMapping("/api")
public class DiscoveryResource {

    private final Logger log = LoggerFactory.getLogger(DiscoveryResource.class);
    private final DiscoveryBackendSelector selector;
    private final String preferredBackend;

    public DiscoveryResource(DiscoveryBackendSelector selector, ApplicationProperties applicationProperties) {
        this.selector = selector;
        this.preferredBackend = applicationProperties.getDiscovery().getBackend();
    }

    /**
     * GET  /discovery/backend : get the active discovery backend name
     *
     * @return JSON with "name" and "active" fields
     */
    @GetMapping("/discovery/backend")
    public ResponseEntity<Map<String, Object>> getBackend() {
        Optional<DiscoveryBackend> backend = selector.selectBackend(preferredBackend);
        Map<String, Object> result = new HashMap<>();
        result.put("name", backend.map(DiscoveryBackend::getName).orElse("none"));
        result.put("active", backend.isPresent());
        return ResponseEntity.ok(result);
    }

    /**
     * GET  /discovery/backends : list all available backends with their active status
     *
     * @return list of backend descriptors
     */
    @GetMapping("/discovery/backends")
    public ResponseEntity<List<Map<String, Object>>> listBackends() {
        List<Map<String, Object>> result = selector.getBackends().stream()
            .map(b -> {
                Map<String, Object> info = new HashMap<>();
                info.put("name", b.getName());
                info.put("active", b.isActive());
                return info;
            })
            .toList();
        return ResponseEntity.ok(result);
    }

    /**
     * GET  /discovery/applications : get registered applications from the active backend
     *
     * @return JSON with "backend" name and "applications" array
     */
    @GetMapping("/discovery/applications")
    public ResponseEntity<Map<String, Object>> getApplications() {
        Optional<DiscoveryBackend> backend = selector.selectBackend(preferredBackend);
        if (backend.isEmpty()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("error", "No active discovery backend available"));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("backend", backend.get().getName());
        result.put("applications", backend.get().getApplications());
        return ResponseEntity.ok(result);
    }

    /**
     * GET  /discovery/status : get active discovery backend status
     *
     * @return JSON with "backend" name and "status" object
     */
    @GetMapping("/discovery/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Optional<DiscoveryBackend> backend = selector.selectBackend(preferredBackend);
        if (backend.isEmpty()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("error", "No active discovery backend available"));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("backend", backend.get().getName());
        result.put("status", backend.get().getStatus());
        return ResponseEntity.ok(result);
    }

    /**
     * GET  /discovery/replicas : get replica/peer addresses from the active backend
     *
     * @return JSON with "backend" name and "replicas" array
     */
    @GetMapping("/discovery/replicas")
    public ResponseEntity<Map<String, Object>> getReplicas() {
        Optional<DiscoveryBackend> backend = selector.selectBackend(preferredBackend);
        if (backend.isEmpty()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("error", "No active discovery backend available"));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("backend", backend.get().getName());
        result.put("replicas", backend.get().getReplicas());
        return ResponseEntity.ok(result);
    }

    /**
     * GET  /discovery/history : get registration/event history from the active backend
     *
     * @return JSON with backend history, or empty object if not supported
     */
    @GetMapping("/discovery/history")
    public ResponseEntity<Map<String, Object>> getHistory() {
        Optional<DiscoveryBackend> backend = selector.selectBackend(preferredBackend);
        if (backend.isEmpty()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("error", "No active discovery backend available"));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("backend", backend.get().getName());
        backend.get().getHistory().ifPresentOrElse(
            history -> result.put("history", history),
            () -> result.put("history", Map.of())
        );
        return ResponseEntity.ok(result);
    }
}
