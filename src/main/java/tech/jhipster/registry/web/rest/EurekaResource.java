package tech.jhipster.registry.web.rest;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.registry.service.discovery.RegistryDiscoveryBackend;
import tech.jhipster.registry.web.rest.vm.EurekaVM;

/** Discovery data exposed through the existing Registry API. */
@RestController
@RequestMapping("/api")
public class EurekaResource {

    private final RegistryDiscoveryBackend discoveryBackend;

    public EurekaResource(RegistryDiscoveryBackend discoveryBackend) {
        this.discoveryBackend = discoveryBackend;
    }

    @GetMapping("/eureka/applications")
    public ResponseEntity<EurekaVM> eureka() {
        EurekaVM result = new EurekaVM();
        result.setApplications(discoveryBackend.getApplications());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/eureka/lastn")
    public ResponseEntity<Map<String, Map<Long, String>>> lastn() {
        return ResponseEntity.ok(discoveryBackend.getLastN());
    }

    @GetMapping("/eureka/replicas")
    public ResponseEntity<List<String>> replicas() {
        return ResponseEntity.ok(discoveryBackend.getReplicas());
    }

    @GetMapping("/eureka/status")
    public ResponseEntity<EurekaVM> eurekaStatus() {
        EurekaVM result = new EurekaVM();
        result.setStatus(discoveryBackend.getStatus());
        return ResponseEntity.ok(result);
    }
}
