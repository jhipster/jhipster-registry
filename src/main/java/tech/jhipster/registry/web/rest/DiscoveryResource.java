package tech.jhipster.registry.web.rest;

import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.registry.service.discovery.DiscoveryService;
import tech.jhipster.registry.web.rest.vm.EurekaVM;

@RestController
@RequestMapping("/api")
public class DiscoveryResource {

    private final Logger log = LoggerFactory.getLogger(DiscoveryResource.class);

    private final DiscoveryService discoveryService;

    public DiscoveryResource(DiscoveryService discoveryService) {
        this.discoveryService = discoveryService;
    }

    @GetMapping("/discovery/applications")
    public ResponseEntity<EurekaVM> applications() {
        EurekaVM vm = new EurekaVM();
        vm.setApplications(discoveryService.getApplications());
        return new ResponseEntity<>(vm, HttpStatus.OK);
    }

    @GetMapping("/discovery/status")
    public ResponseEntity<EurekaVM> status() {
        EurekaVM vm = new EurekaVM();
        vm.setStatus(discoveryService.getStatus());
        return new ResponseEntity<>(vm, HttpStatus.OK);
    }

    @GetMapping("/discovery/replicas")
    public ResponseEntity<List<String>> replicas() {
        return new ResponseEntity<>(discoveryService.getReplicas(), HttpStatus.OK);
    }

    @GetMapping("/discovery/lastn")
    public ResponseEntity<Map<String, Map<Long, String>>> lastn() {
        return new ResponseEntity<>(discoveryService.getLastN(), HttpStatus.OK);
    }

    @GetMapping("/discovery/backend")
    public ResponseEntity<Map<String, String>> backend() {
        return new ResponseEntity<>(Map.of("backend", discoveryService.getBackendType()), HttpStatus.OK);
    }
}
