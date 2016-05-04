package io.github.jhipster.registry.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.codahale.metrics.annotation.Timed;
import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.shared.Application;
import com.netflix.eureka.EurekaServerContext;
import com.netflix.eureka.EurekaServerContextHolder;
import com.netflix.eureka.cluster.PeerEurekaNode;
import com.netflix.eureka.registry.PeerAwareInstanceRegistry;
import com.netflix.eureka.registry.PeerAwareInstanceRegistryImpl;

import io.github.jhipster.registry.web.rest.dto.EurekaDTO;

/**
 * Controller for viewing Eureka data.
 */
@RestController
@RequestMapping("/api")
public class EurekaResource {

    private final Logger log = LoggerFactory.getLogger(EurekaResource.class);

    /**
     * GET  /eureka/applications : get Eureka applications information
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

    private List<Map<String, Object>> getApplications() {
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

    /**
     * GET  /eureka/lastn : get Eureka registrations
     */
    @RequestMapping(value = "/eureka/lastn",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Map<String, Map<Long, String>>> lastn() {
        Map<String, Map<Long, String>> lastn = new HashMap<>();
        PeerAwareInstanceRegistryImpl registry = (PeerAwareInstanceRegistryImpl) getRegistry();
        Map<Long, String> canceledMap = new HashMap<>();
        registry.getLastNCanceledInstances().stream().forEach(
            canceledInstance -> {
                canceledMap.put(canceledInstance.first(), canceledInstance.second());
            }
        );
        lastn.put("canceled", canceledMap);
        Map<Long, String> registeredMap = new HashMap<>();
        registry.getLastNRegisteredInstances().stream().forEach(
            registeredInstance -> {
                registeredMap.put(registeredInstance.first(), registeredInstance.second());
            }
        );
        lastn.put("registered", registeredMap);
        return new ResponseEntity<>(lastn, HttpStatus.OK);
    }

    /**
     * GET  /eureka/replicas : get Eureka replicas
     */
    @RequestMapping(value = "/eureka/replicas",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<String>> replicas() {
        List<String> replicas = new ArrayList<>();
        getServerContext().getPeerEurekaNodes().getPeerNodesView().stream().forEach(
            node -> {
                try {
                    // The URL is parsed in order to remove login/password information
                    URI uri = new URI(node.getServiceUrl());
                    replicas.add(uri.getHost() + ":" + uri.getPort());
                } catch (URISyntaxException e) {
                    log.warn("Could not parse peer Eureka node URL: {}", e.getMessage());
                }
            }
        );

        return new ResponseEntity<>(replicas, HttpStatus.OK);
    }

    private PeerAwareInstanceRegistry getRegistry() {
        return getServerContext().getRegistry();
    }

    private EurekaServerContext getServerContext() {
        return EurekaServerContextHolder.getInstance().getServerContext();
    }

}
