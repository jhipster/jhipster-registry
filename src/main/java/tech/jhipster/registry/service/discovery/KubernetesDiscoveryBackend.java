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
import org.springframework.cloud.client.discovery.health.DiscoveryCompositeHealthContributor;
import org.springframework.stereotype.Component;

/**
 * Kubernetes implementation of the {@link DiscoveryBackend} interface.
 * <p>
 * This backend uses Spring Cloud's {@link DiscoveryClient} abstraction to
 * query Kubernetes for services and endpoints. It is active when Kubernetes
 * service discovery is enabled via
 * {@code spring.cloud.kubernetes.discovery.enabled=true}.
 * <p>
 * By using the standard {@link DiscoveryClient} interface, this implementation
 * works with any Kubernetes-aware Spring Cloud configuration, providing a
 * consistent interface across all discovery backends.
 */
@Component
@ConditionalOnClass(name = "org.springframework.cloud.kubernetes.commons.discovery.KubernetesDiscoveryClient")
@ConditionalOnProperty(name = "spring.cloud.kubernetes.discovery.enabled", havingValue = "true")
public class KubernetesDiscoveryBackend implements DiscoveryBackend {

    private final Logger log = LoggerFactory.getLogger(KubernetesDiscoveryBackend.class);
    private final DiscoveryClient discoveryClient;
    private final DiscoveryCompositeHealthContributor kubernetesHealthContributor;

    public KubernetesDiscoveryBackend(DiscoveryClient discoveryClient,
        @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection") DiscoveryCompositeHealthContributor kubernetesHealthContributor) {
        this.discoveryClient = discoveryClient;
        this.kubernetesHealthContributor = kubernetesHealthContributor;
    }

    @Override
    public String getName() {
        return "kubernetes";
    }

    @Override
    public List<Map<String, Object>> getApplications() {
        List<Map<String, Object>> apps = new ArrayList<>();
        try {
            List<String> serviceIds = discoveryClient.getServices();
            log.debug("Found {} Kubernetes services", serviceIds.size());

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
                    inst.put("instanceId", instance.getInstanceId() != null ? instance.getInstanceId()
                        : serviceId + ":" + instance.getHost() + ":" + instance.getPort());
                    inst.put("homePageUrl", buildUrl(instance, ""));
                    inst.put("healthCheckUrl", buildUrl(instance, "/actuator/health"));
                    inst.put("statusPageUrl", buildUrl(instance, "/actuator/info"));
                    inst.put("status", "UP");
                    Map<String, String> metadata = new HashMap<>();
                    if (instance.getMetadata() != null) {
                        metadata.putAll(instance.getMetadata().entrySet().stream()
                            .collect(HashMap::new, (m, e) -> m.put(e.getKey(), String.valueOf(e.getValue())), Map::putAll));
                    }
                    inst.put("metadata", metadata);
                    instanceList.add(inst);
                }
                appData.put("instances", instanceList);
                apps.add(appData);
            }
        } catch (Exception e) {
            log.warn("Could not retrieve Kubernetes services via DiscoveryClient: {}", e.getMessage());
        }
        return apps;
    }

    @Override
    public Map<String, Object> getStatus() {
        Map<String, Object> stats = new HashMap<>();
        try {
            var healthIterator = kubernetesHealthContributor.iterator();
            List<Map<String, Object>> indicators = new ArrayList<>();
            healthIterator.forEachRemaining(healthIndicator -> {
                try {
                    var health = healthIndicator.getHealth(true);
                    Map<String, Object> indicatorInfo = new HashMap<>();
                    indicatorInfo.put("name", healthIndicator.getName());
                    indicatorInfo.put("status", health.getStatus().getCode());
                    if (health.getDetails() != null) {
                        indicatorInfo.put("details", health.getDetails());
                    }
                    indicators.add(indicatorInfo);
                } catch (Exception e) {
                    log.debug("Could not read Kubernetes health indicator: {}", e.getMessage());
                }
            });
            stats.put("kubernetesHealth", indicators);
            stats.put("time", System.currentTimeMillis());
        } catch (Exception e) {
            log.warn("Could not retrieve Kubernetes status: {}", e.getMessage());
            stats.put("error", e.getMessage());
        }
        return stats;
    }

    @Override
    public List<String> getReplicas() {
        // Kubernetes manages services via kube-proxy and DNS; return empty list
        // as replica information is not applicable in this context
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
