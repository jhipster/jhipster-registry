package io.github.jhipster.registry.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static io.github.jhipster.registry.config.Constants.*;

/**
 * Controller for viewing service discovery data.
 */
@Profile({PROFILE_EUREKA, PROFILE_CONSULDISCOVERY, PROFILE_KUBERNTETES})
@RestController
@RequestMapping("/api")
public class ServiceDiscoveryResource {

    private final Logger log = LoggerFactory.getLogger(EurekaResource.class);

    private final DiscoveryClient discoveryClient;

    public ServiceDiscoveryResource(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    /**
     * GET /service-discovery/instances : get applications instances
     * registered to the service discovery provider.
     */
    @GetMapping("/service-discovery/instances")
    @Timed
    public ResponseEntity<List<List<ServiceInstance>>> instances() {
        List<String> services = discoveryClient.getServices();
        List<List<ServiceInstance>> instances = services.stream()
            .map(discoveryClient::getInstances)
            .collect(Collectors.toList());
        return new ResponseEntity<>(instances, HttpStatus.OK);
    }
}
