package tech.jhipster.registry.web.rest;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.registry.service.discovery.DiscoveryService;
import tech.jhipster.registry.web.rest.vm.EurekaVM;

/**
 * Controller for viewing discovery data. Delegates to the active DiscoveryService implementation
 * (Eureka by default; Consul or Kubernetes when those profiles are active).
 */
@RestController
@RequestMapping("/api")
public class EurekaResource {

    private final DiscoveryService discoveryService;

    public EurekaResource(DiscoveryService discoveryService) {
        this.discoveryService = discoveryService;
    }

    @GetMapping("/eureka/applications")
    public ResponseEntity<EurekaVM> eureka() {
        EurekaVM eurekaVM = new EurekaVM();
        eurekaVM.setApplications(discoveryService.getApplications());
        return ResponseEntity.ok(eurekaVM);
    }

    @GetMapping("/discovery/applications")
    public ResponseEntity<EurekaVM> applications() {
        return eureka();
    }

    @GetMapping("/eureka/lastn")
    public ResponseEntity<Map<String, Map<Long, String>>> lastn() {
        return ResponseEntity.ok(discoveryService.getHistory());
    }

    @GetMapping("/discovery/history")
    public ResponseEntity<Map<String, Map<Long, String>>> history() {
        return lastn();
    }

    @GetMapping("/eureka/replicas")
    public ResponseEntity<List<String>> replicas() {
        return ResponseEntity.ok(discoveryService.getReplicas());
    }

    @GetMapping("/discovery/replicas")
    public ResponseEntity<List<String>> discoveryReplicas() {
        return replicas();
    }

    @GetMapping("/eureka/status")
    public ResponseEntity<EurekaVM> eurekaStatus() {
        EurekaVM eurekaVM = new EurekaVM();
        eurekaVM.setStatus(discoveryService.getStatus());
        return ResponseEntity.ok(eurekaVM);
    }

    @GetMapping("/discovery/status")
    public ResponseEntity<EurekaVM> status() {
        return eurekaStatus();
    }
}
