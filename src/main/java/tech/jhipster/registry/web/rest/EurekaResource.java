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
public class EurekaResource {

    private final Logger log = LoggerFactory.getLogger(EurekaResource.class);

    private final DiscoveryService discoveryService;

    public EurekaResource(DiscoveryService discoveryService) {
        this.discoveryService = discoveryService;
    }

    @GetMapping("/eureka/applications")
    public ResponseEntity<EurekaVM> eureka() {
        EurekaVM eurekaVM = new EurekaVM();
        eurekaVM.setApplications(discoveryService.getApplications());
        return new ResponseEntity<>(eurekaVM, HttpStatus.OK);
    }

    @GetMapping("/eureka/lastn")
    public ResponseEntity<Map<String, Map<Long, String>>> lastn() {
        return new ResponseEntity<>(discoveryService.getLastN(), HttpStatus.OK);
    }

    @GetMapping("/eureka/replicas")
    public ResponseEntity<List<String>> replicas() {
        return new ResponseEntity<>(discoveryService.getReplicas(), HttpStatus.OK);
    }

    @GetMapping("/eureka/status")
    public ResponseEntity<EurekaVM> eurekaStatus() {
        EurekaVM eurekaVM = new EurekaVM();
        eurekaVM.setStatus(discoveryService.getStatus());
        return new ResponseEntity<>(eurekaVM, HttpStatus.OK);
    }
}
