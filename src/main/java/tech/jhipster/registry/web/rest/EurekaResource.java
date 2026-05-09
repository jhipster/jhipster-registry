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
import tech.jhipster.registry.service.discovery.EurekaDiscoveryBackend;
import tech.jhipster.registry.web.rest.vm.EurekaVM;

/**
 * Controller for viewing Eureka data.
 * <p>
 * Delegates to {@link EurekaDiscoveryBackend} for data retrieval.
 * Kept for backward compatibility with existing frontend components
 * and the external monitoring systems.
 */
@RestController
@RequestMapping("/api")
public class EurekaResource {

    private final Logger log = LoggerFactory.getLogger(EurekaResource.class);
    private final EurekaDiscoveryBackend eurekaBackend;

    public EurekaResource(EurekaDiscoveryBackend eurekaBackend) {
        this.eurekaBackend = eurekaBackend;
    }

    /**
     * GET  /eureka/applications : get Eureka applications information
     */
    @GetMapping("/eureka/applications")
    public ResponseEntity<EurekaVM> eureka() {
        EurekaVM eurekaVM = new EurekaVM();
        eurekaVM.setApplications(eurekaBackend.getApplications());
        return new ResponseEntity<>(eurekaVM, HttpStatus.OK);
    }

    /**
     * GET  /eureka/lastn : get Eureka registrations
     */
    @GetMapping("/eureka/lastn")
    public ResponseEntity<Map<String, Map<Long, String>>> lastn() {
        return ResponseEntity.of(
            eurekaBackend.getHistory()
        );
    }

    /**
     * GET  /eureka/replicas : get Eureka replicas
     */
    @GetMapping("/eureka/replicas")
    public ResponseEntity<List<String>> replicas() {
        return new ResponseEntity<>(eurekaBackend.getReplicas(), HttpStatus.OK);
    }

    /**
     * GET  /eureka/status : get Eureka status
     */
    @GetMapping("/eureka/status")
    public ResponseEntity<EurekaVM> eurekaStatus() {
        EurekaVM eurekaVM = new EurekaVM();
        eurekaVM.setStatus(eurekaBackend.getStatus());
        return new ResponseEntity<>(eurekaVM, HttpStatus.OK);
    }
}
