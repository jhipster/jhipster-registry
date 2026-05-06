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
import tech.jhipster.registry.service.discovery.DiscoveryBackend;
import tech.jhipster.registry.service.discovery.DiscoveryBackendSelector;

/**
 * Unified controller for viewing discovery backend data.
 * Works with Eureka, Consul, or Kubernetes depending on configuration.
 */
@RestController
@RequestMapping("/api")
public class DiscoveryResource {

    private final Logger log = LoggerFactory.getLogger(DiscoveryResource.class);
    private final DiscoveryBackendSelector selector;
    private final String preferredBackend;

    public DiscoveryResource(DiscoveryBackendSelector selector, tech.jhipster.registry.config.ApplicationProperties applicationProperties) {
        this.selector = selector;
        this.preferredBackend = applicationProperties.getDiscovery().getBackend();
    }

    /**
     * GET  /discovery/backend : get the active discovery backend name
     */
    @GetMapping("/discovery/backend")
    public ResponseEntity<Map<String, String>> getBackend() {
        Optional<DiscoveryBackend> backend = selector.selectBackend(preferredBackend);
        Map<String, String> result = new HashMap<>();
        if (backend.isPresent()) {
            result.put("name", backend.get().getName());
            result.put("active", "true");
        } else {
            result.put("name", "none");
            result.put("active", "false");
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * GET  /discovery/applications : get registered applications
     */
    @GetMapping("/discovery/applications")
    public ResponseEntity<Map<String, Object>> getApplications() {
        Optional<DiscoveryBackend> backend = selector.selectBackend(preferredBackend);
        if (backend.isEmpty()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("error", "No discovery backend available"));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("backend", backend.get().getName());
        result.put("applications", backend.get().getApplications());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * GET  /discovery/status : get discovery backend status
     */
    @GetMapping("/discovery/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Optional<DiscoveryBackend> backend = selector.selectBackend(preferredBackend);
        if (backend.isEmpty()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("error", "No discovery backend available"));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("backend", backend.get().getName());
        result.put("status", backend.get().getStatus());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * GET  /discovery/replicas : get replicas/peers
     */
    @GetMapping("/discovery/replicas")
    public ResponseEntity<Map<String, Object>> getReplicas() {
        Optional<DiscoveryBackend> backend = selector.selectBackend(preferredBackend);
        if (backend.isEmpty()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("error", "No discovery backend available"));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("backend", backend.get().getName());
        result.put("replicas", backend.get().getReplicas());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * GET  /discovery/backends : list all available backends
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
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
