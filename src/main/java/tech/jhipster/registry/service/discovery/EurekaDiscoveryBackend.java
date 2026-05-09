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
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import tech.jhipster.registry.config.ApplicationProperties;

/**
 * Eureka implementation of the {@link DiscoveryBackend} interface.
 * <p>
 * This backend is the default and is active when Eureka is on the classpath
 * and {@code eureka.client.enabled=true} (the default).
 */
@Component
@ConditionalOnClass(name = "com.netflix.eureka.EurekaServerContext")
@ConditionalOnProperty(name = "eureka.client.enabled", havingValue = "true", matchIfMissing = true)
public class EurekaDiscoveryBackend implements DiscoveryBackend {

    private final Logger log = LoggerFactory.getLogger(EurekaDiscoveryBackend.class);
    private final ApplicationProperties applicationProperties;

    public EurekaDiscoveryBackend(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    @Override
    public String getName() {
        return "eureka";
    }

    @Override
    public List<Map<String, Object>> getApplications() {
        try {
            PeerAwareInstanceRegistry registry = getRegistry();
            if (registry == null) {
                log.warn("Eureka registry is not available");
                return List.of();
            }
            List<Application> sortedApplications = registry.getSortedApplications();
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
        } catch (Exception e) {
            log.error("Could not retrieve Eureka applications: {}", e.getMessage());
            return List.of();
        }
    }

    @Override
    public Map<String, Object> getStatus() {
        Map<String, Object> stats = new HashMap<>();
        try {
            stats.put("time", new Date());
            stats.put("currentTime", StatusResource.getCurrentTimeAsString());
            stats.put("upTime", StatusInfo.getUpTime());
            stats.put("environment", applicationProperties.getEureka().getEnvironment());
            stats.put("datacenter", applicationProperties.getEureka().getDatacenter());
            PeerAwareInstanceRegistry registry = getRegistry();
            if (registry != null) {
                stats.put("isBelowRenewThreshold", registry.isBelowRenewThresold() == 1);
            }
            populateInstanceInfo(stats);
        } catch (Exception e) {
            log.error("Could not retrieve Eureka status: {}", e.getMessage());
            stats.put("error", e.getMessage());
        }
        return stats;
    }

    @Override
    public List<String> getReplicas() {
        List<String> replicas = new ArrayList<>();
        try {
            EurekaServerContext serverContext = getServerContext();
            if (serverContext == null) {
                return replicas;
            }
            serverContext
                .getPeerEurekaNodes()
                .getPeerNodesView()
                .forEach(node -> {
                    try {
                        // Parse URL to remove login/password information
                        URI uri = new URI(node.getServiceUrl());
                        replicas.add(uri.getHost() + ":" + uri.getPort());
                    } catch (URISyntaxException e) {
                        log.warn("Could not parse peer Eureka node URL: {}", e.getMessage());
                    }
                });
        } catch (Exception e) {
            log.warn("Could not retrieve Eureka replicas: {}", e.getMessage());
        }
        return replicas;
    }

    @Override
    public Optional<Map<String, Map<Long, String>>> getHistory() {
        Map<String, Map<Long, String>> history = new HashMap<>();
        try {
            PeerAwareInstanceRegistry registry = getRegistry();
            if (registry instanceof PeerAwareInstanceRegistryImpl) {
                PeerAwareInstanceRegistryImpl impl = (PeerAwareInstanceRegistryImpl) registry;
                Map<Long, String> canceledMap = impl.getLastNCanceledInstances().stream()
                    .collect(toMap(Pair::first, Pair::second));
                history.put("canceled", canceledMap);
                Map<Long, String> registeredMap = impl.getLastNRegisteredInstances().stream()
                    .collect(toMap(Pair::first, Pair::second));
                history.put("registered", registeredMap);
                return Optional.of(history);
            }
        } catch (Exception e) {
            log.warn("Could not retrieve Eureka registration history: {}", e.getMessage());
        }
        return Optional.of(history);
    }

    @Override
    public boolean isActive() {
        try {
            return getServerContext() != null && getServerContext().getRegistry() != null;
        } catch (Exception e) {
            return false;
        }
    }

    private void populateInstanceInfo(Map<String, Object> model) {
        StatusInfo statusInfo;
        try {
            statusInfo = new StatusResource().getStatusInfo();
        } catch (Exception e) {
            log.error("Could not retrieve Eureka instance info: {}", e.getMessage());
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
        EurekaServerContext context = getServerContext();
        return context != null ? context.getRegistry() : null;
    }

    private EurekaServerContext getServerContext() {
        try {
            return EurekaServerContextHolder.getInstance().getServerContext();
        } catch (Exception e) {
            log.warn("Eureka server context not available: {}", e.getMessage());
            return null;
        }
    }
}
