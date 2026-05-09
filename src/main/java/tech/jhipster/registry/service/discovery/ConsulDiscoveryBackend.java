package tech.jhipster.registry.service.discovery;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.discovery.health.DiscoveryHealthIndicator;
import org.springframework.cloud.client.serviceregistry.Registration;
import org.springframework.stereotype.Component;

/**
 * Consul implementation of the {@link DiscoveryBackend} interface.
 * <p>
 * This backend uses Spring Cloud's {@link DiscoveryClient} abstraction to
 * query Consul for registered services. It is active when Consul service
 * discovery is enabled via {@code spring.cloud.consul.discovery.enabled=true}.
 * <p>
 * Unlike the Eureka backend which directly interacts with the Eureka server,
 * this implementation relies on the standard Spring Cloud DiscoveryClient
 * interface, making it compatible with any Consul-enabled Spring Boot application.
 */
@Component
@ConditionalOnClass(name = "org.springframework.cloud.consul.discovery.ConsulDiscoveryClient")
@ConditionalOnProperty(name = "spring.cloud.consul.discovery.enabled", havingValue = "true")
public class ConsulDiscoveryBackend implements DiscoveryBackend {

    private final Logger log = LoggerFactory.getLogger(ConsulDiscoveryBackend.class);
    private final DiscoveryClient discoveryClient;
    private final DiscoveryHealthIndicator consulHealthIndicator;

    public ConsulDiscoveryBackend(DiscoveryClient discoveryClient,
        @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection") DiscoveryHealthIndicator consulHealthIndicator) {
        this.discoveryClient = discoveryClient;
        this.consulHealthIndicator = consulHealthIndicator;
    }

    @Override
    public String getName() {
        return "consul";
    }

    @Override
    public List<Map<String, Object>> getApplications() {
        List<Map<String, Object>> apps = new ArrayList<>();
        try {
            List<String> serviceIds = discoveryClient.getServices();
            log.debug("Found {} Consul services", serviceIds.size());

            for (String serviceId : serviceIds) {
                var instances = discoveryClient.getInstances(serviceId);
                if (instances.isEmpty()) {
                    continue;
                }

                LinkedHashMap<String, Object> appData = new LinkedHashMap<>();
                appData.put("name", serviceId);
                List<Map<String, Object>> instanceList = new ArrayList<>();
                for (var instance : instances) {
                    Map<String, Object> inst = new HashMap<>();
                    inst.put("instanceId", instance.getInstanceId() != null ? instance.getInstanceId() : instance.getServiceId() + ":" + instance.getHost() + ":" + instance.getPort());
                    inst.put("homePageUrl", buildUrl(instance, ""));
                    inst.put("healthCheckUrl", buildUrl(instance, "/actuator/health"));
                    inst.put("statusPageUrl", buildUrl(instance, "/actuator/info"));
                    inst.put("status", instance.isSecure() ? "UP" : "UP");
                    inst.put("metadata", instance.getMetadata() != null ? instance.getMetadata() : Map.of());
                    instanceList.add(inst);
                }
                appData.put("instances", instanceList);
                apps.add(appData);
            }
        } catch (Exception e) {
            log.warn("Could not retrieve Consul services via DiscoveryClient: {}", e.getMessage());
        }
        return apps;
    }

    @Override
    public Map<String, Object> getStatus() {
        Map<String, Object> stats = new HashMap<>();
        try {
            var health = consulHealthIndicator.health();
            stats.put("consulHealth", health.getStatus().getCode());
            if (health.getDetails() != null) {
                stats.put("details", health.getDetails());
            }
            stats.put("time", System.currentTimeMillis());
        } catch (Exception e) {
            log.warn("Could not retrieve Consul status: {}", e.getMessage());
            stats.put("error", e.getMessage());
        }
        return stats;
    }

    @Override
    public List<String> getReplicas() {
        // Consul manages its own cluster; return empty list as peer info
        // is handled by Consul itself and not exposed via DiscoveryClient
        return List.of();
    }

    @Override
    public boolean isActive() {
        try {
            return discoveryClient.getServices() != null;
        } catch (Exception e) {
            return false;
        }
    }

    private String buildUrl(org.springframework.cloud.client.ServiceInstance instance, String path) {
        try {
            URI uri = instance.getUri();
            return uri.toString() + path;
        } catch (Exception e) {
            String scheme = instance.isSecure() ? "https" : "http";
            return scheme + "://" + instance.getHost() + ":" + instance.getPort() + path;
        }
    }
}
