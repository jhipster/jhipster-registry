package tech.jhipster.registry.service.discovery;

import io.fabric8.kubernetes.api.model.Endpoints;
import io.fabric8.kubernetes.api.model.EndpointsAddress;
import io.fabric8.kubernetes.client.KubernetesClient;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Kubernetes implementation of the DiscoveryBackend interface.
 * This backend is active when spring.cloud.kubernetes.discovery.enabled=true.
 */
@Component
@ConditionalOnClass(name = "io.fabric8.kubernetes.client.KubernetesClient")
@ConditionalOnProperty(name = "spring.cloud.kubernetes.discovery.enabled", havingValue = "true")
public class KubernetesDiscoveryBackend implements DiscoveryBackend {

    private final Logger log = LoggerFactory.getLogger(KubernetesDiscoveryBackend.class);
    private final KubernetesClient kubernetesClient;

    public KubernetesDiscoveryBackend(KubernetesClient kubernetesClient) {
        this.kubernetesClient = kubernetesClient;
    }

    @Override
    public String getName() {
        return "kubernetes";
    }

    @Override
    public List<Map<String, Object>> getApplications() {
        List<Map<String, Object>> apps = new ArrayList<>();
        try {
            // Get all services in the current namespace
            Map<String, List<Map<String, Object>>> grouped = new HashMap<>();

            kubernetesClient.services().list().getItems().forEach(service -> {
                String serviceName = service.getMetadata().getName();
                String namespace = service.getMetadata().getNamespace();

                // Try to get endpoints for this service
                Endpoints endpoints = kubernetesClient.endpoints()
                    .inNamespace(namespace)
                    .withName(serviceName)
                    .get();

                if (endpoints != null && endpoints.getSubsets() != null) {
                    endpoints.getSubsets().forEach(subset -> {
                        if (subset.getAddresses() != null) {
                            for (EndpointsAddress addr : subset.getAddresses()) {
                                Map<String, Object> instance = new HashMap<>();
                                instance.put("instanceId", addr.getIp() + "-" + serviceName);
                                instance.put("homePageUrl", buildHomePageUrl(addr, subset.getPorts().get(0).getPort()));
                                instance.put("healthCheckUrl", "");
                                instance.put("statusPageUrl", "");
                                instance.put("status", "UP");
                                instance.put("metadata", Map.of(
                                    "namespace", namespace,
                                    "nodeName", addr.getNodeName() != null ? addr.getNodeName() : ""
                                ));
                                grouped.computeIfAbsent(serviceName, k -> new ArrayList<>()).add(instance);
                            }
                        }
                    });
                }
            });

            for (Map.Entry<String, List<Map<String, Object>>> entry : grouped.entrySet()) {
                Map<String, Object> appData = new LinkedHashMap<>();
                appData.put("name", entry.getKey());
                appData.put("instances", entry.getValue());
                apps.add(appData);
            }
        } catch (Exception e) {
            log.warn("Could not retrieve Kubernetes services: {}", e.getMessage());
        }
        return apps;
    }

    @Override
    public Map<String, Object> getStatus() {
        Map<String, Object> stats = new HashMap<>();
        try {
            stats.put("namespace", kubernetesClient.getNamespace());
            stats.put("masterUrl", kubernetesClient.getMasterUrl().toString());
            stats.put("time", System.currentTimeMillis());
        } catch (Exception e) {
            log.warn("Could not retrieve Kubernetes status: {}", e.getMessage());
            stats.put("error", e.getMessage());
        }
        return stats;
    }

    @Override
    public List<String> getReplicas() {
        // Kubernetes doesn't have the same concept of replicas for service discovery
        // Return empty list as this is handled by Kubernetes itself
        return new ArrayList<>();
    }

    @Override
    public boolean isActive() {
        try {
            kubernetesClient.namespaces().list();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String buildHomePageUrl(EndpointsAddress addr, int port) {
        return "http://" + addr.getIp() + ":" + port;
    }
}
