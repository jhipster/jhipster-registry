package io.github.jhipster.registry.web.rest;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.codahale.metrics.annotation.Timed;
import com.netflix.appinfo.*;
import com.netflix.discovery.shared.Application;
import com.netflix.discovery.shared.Pair;
import com.netflix.eureka.EurekaServerContext;
import com.netflix.eureka.EurekaServerContextHolder;
import com.netflix.eureka.registry.PeerAwareInstanceRegistry;

import io.github.jhipster.registry.web.rest.dto.EurekaDTO;

/**
 * Controller for viewing Eureka data.
 */
@RestController
@RequestMapping("/api")
public class EurekaResource {

    private final Logger log = LoggerFactory.getLogger(EurekaResource.class);

    /**
     * GET  / : get Eureka information
     */
    @RequestMapping(value = "/eureka/applications",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<EurekaDTO> eureka() {
        EurekaDTO eurekaDTO = new EurekaDTO();
        eurekaDTO.setApplications(getApplications());
        return new ResponseEntity<>(eurekaDTO, HttpStatus.OK);
    }

    private ArrayList<Map<String, Object>> getApplications() {
        List<Application> sortedApplications = getRegistry().getSortedApplications();
        ArrayList<Map<String, Object>> apps = new ArrayList<>();
        for (Application app : sortedApplications) {
            LinkedHashMap<String, Object> appData = new LinkedHashMap<>();
            apps.add(appData);
            appData.put("name", app.getName());
            List<Map<String, String>> instances = new ArrayList<>();
            for (InstanceInfo info : app.getInstances()) {
                Map<String, String> instance = new HashMap<>();
                instance.put("instanceId", info.getInstanceId());
                instance.put("homePageUrl", info.getHomePageUrl());
                instance.put("healthCheckUrl", info.getHealthCheckUrl());
                instance.put("statusPageUrl", info.getStatusPageUrl());
                instance.put("status", info.getStatus().name());
                instances.add(instance);
            }
            appData.put("instances", instances);
        }
        return apps;
    }

    private PeerAwareInstanceRegistry getRegistry() {
        return getServerContext().getRegistry();
    }

    private EurekaServerContext getServerContext() {
        return EurekaServerContextHolder.getInstance().getServerContext();
    }

}
