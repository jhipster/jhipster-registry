package tech.jhipster.registry.service.discovery;

import static java.util.stream.Collectors.toMap;

import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.shared.Application;
import com.netflix.discovery.shared.Pair;
import com.netflix.eureka.EurekaServerContext;
import com.netflix.eureka.EurekaServerContextHolder;
import com.netflix.eureka.registry.PeerAwareInstanceRegistry;
import com.netflix.eureka.registry.PeerAwareInstanceRegistryImpl;
import com.netflix.eureka.resources.StatusResource;
import com.netflix.eureka.util.StatusInfo;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import tech.jhipster.registry.config.ApplicationProperties;

@Service
@ConditionalOnProperty(name = "application.discovery.backend", havingValue = "eureka", matchIfMissing = true)
public class EurekaDiscoveryService implements DiscoveryService {

    private final Logger log = LoggerFactory.getLogger(EurekaDiscoveryService.class);

    private final ApplicationProperties applicationProperties;

    public EurekaDiscoveryService(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    @Override
    public String getBackendType() {
        return "eureka";
    }

    @Override
    public List<Map<String, Object>> getApplications() {
        List<Application> sortedApplications = getRegistry().getSortedApplications();
        ArrayList<Map<String, Object>> apps = new ArrayList<>();
        for (Application app : sortedApplications) {
            LinkedHashMap<String, Object> appData = new LinkedHashMap<>();
            apps.add(appData);
            appData.put("name", app.getName());
            List<Map<String, Object>> instances = new ArrayList<>();
            for (InstanceInfo info : app.getInstances()) {
                Map<String, Object> instance = new HashMap<>();
                instance.put("instanceId", info.getInstanceId());
                instance.put("homePageUrl", info.getHomePageUrl());
                instance.put("healthCheckUrl", info.getHealthCheckUrl());
                instance.put("statusPageUrl", info.getStatusPageUrl());
                instance.put("status", info.getStatus().name());
                instance.put("metadata", info.getMetadata());
                instances.add(instance);
            }
            appData.put("instances", instances);
        }
        return apps;
    }

    @Override
    public Map<String, Object> getStatus() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("time", new Date());
        stats.put("currentTime", StatusResource.getCurrentTimeAsString());
        stats.put("upTime", StatusInfo.getUpTime());
        stats.put("environment", applicationProperties.getEureka().getEnvironment());
        stats.put("datacenter", applicationProperties.getEureka().getDatacenter());
        PeerAwareInstanceRegistry registry = getRegistry();
        stats.put("isBelowRenewThreshold", registry.isBelowRenewThresold() == 1);
        populateInstanceInfo(stats);
        return stats;
    }

    @Override
    public List<String> getReplicas() {
        List<String> replicas = new ArrayList<>();
        getServerContext()
            .getPeerEurekaNodes()
            .getPeerNodesView()
            .forEach(node -> {
                try {
                    URI uri = new URI(node.getServiceUrl());
                    replicas.add(uri.getHost() + ":" + uri.getPort());
                } catch (URISyntaxException e) {
                    log.warn("Could not parse peer Eureka node URL: {}", e.getMessage());
                }
            });
        return replicas;
    }

    @Override
    public Map<String, Map<Long, String>> getLastN() {
        Map<String, Map<Long, String>> lastn = new HashMap<>();
        PeerAwareInstanceRegistryImpl registry = (PeerAwareInstanceRegistryImpl) getRegistry();
        Map<Long, String> canceledMap = registry.getLastNCanceledInstances().stream().collect(toMap(Pair::first, Pair::second));
        lastn.put("canceled", canceledMap);
        Map<Long, String> registeredMap = registry.getLastNRegisteredInstances().stream().collect(toMap(Pair::first, Pair::second));
        lastn.put("registered", registeredMap);
        return lastn;
    }

    private void populateInstanceInfo(Map<String, Object> model) {
        StatusInfo statusInfo;
        try {
            statusInfo = new StatusResource().getStatusInfo();
        } catch (Exception e) {
            log.error(e.getMessage());
            statusInfo = StatusInfo.Builder.newBuilder().isHealthy(false).build();
        }
        if (statusInfo != null && statusInfo.getGeneralStats() != null) {
            model.put("generalStats", statusInfo.getGeneralStats());
        }
        if (statusInfo != null && statusInfo.getInstanceInfo() != null) {
            InstanceInfo instanceInfo = statusInfo.getInstanceInfo();
            Map<String, String> instanceMap = new HashMap<>();
            instanceMap.put("ipAddr", instanceInfo.getIPAddr());
            instanceMap.put("status", instanceInfo.getStatus().toString());
            model.put("instanceInfo", instanceMap);
        }
    }

    private PeerAwareInstanceRegistry getRegistry() {
        return getServerContext().getRegistry();
    }

    private EurekaServerContext getServerContext() {
        return EurekaServerContextHolder.getInstance().getServerContext();
    }
}
