package tech.jhipster.registry.service.discovery;

import com.ecwid.consul.v1.ConsulClient;
import com.ecwid.consul.v1.Response;
import com.ecwid.consul.v1.agent.model.Service;
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
 * Consul implementation of the DiscoveryBackend interface.
 * This backend is active when spring.cloud.consul.discovery.enabled=true.
 */
@Component
@ConditionalOnClass(name = "com.ecwid.consul.v1.ConsulClient")
@ConditionalOnProperty(name = "spring.cloud.consul.discovery.enabled", havingValue = "true")
public class ConsulDiscoveryBackend implements DiscoveryBackend {

    private final Logger log = LoggerFactory.getLogger(ConsulDiscoveryBackend.class);
    private final ConsulClient consulClient;

    public ConsulDiscoveryBackend(ConsulClient consulClient) {
        this.consulClient = consulClient;
    }

    @Override
    public String getName() {
        return "consul";
    }

    @Override
    public List<Map<String, Object>> getApplications() {
        List<Map<String, Object>> apps = new ArrayList<>();
        try {
            Response<Map<String, Service>> response = consulClient.getAgentServices();
            Map<String, Service> services = response.getValue();

            // Group services by name
            Map<String, List<Map<String, Object>>> grouped = new HashMap<>();
            for (Map.Entry<String, Service> entry : services.entrySet()) {
                Service service = entry.getValue();
                Map<String, Object> instance = new HashMap<>();
                instance.put("instanceId", service.getId());
                instance.put("homePageUrl", buildHomePageUrl(service));
                instance.put("healthCheckUrl", buildHealthCheckUrl(service));
                instance.put("statusPageUrl", "");
                instance.put("status", "UP");
                instance.put("metadata", service.getMeta());

                String serviceName = service.getService();
                grouped.computeIfAbsent(serviceName, k -> new ArrayList<>()).add(instance);
            }

            for (Map.Entry<String, List<Map<String, Object>>> entry : grouped.entrySet()) {
                Map<String, Object> appData = new LinkedHashMap<>();
                appData.put("name", entry.getKey());
                appData.put("instances", entry.getValue());
                apps.add(appData);
            }
        } catch (Exception e) {
            log.warn("Could not retrieve Consul services: {}", e.getMessage());
        }
        return apps;
    }

    @Override
    public Map<String, Object> getStatus() {
        Map<String, Object> stats = new HashMap<>();
        try {
            Response<Map<String, List<String>>> response = consulClient.getAgentServicesTags();
            stats.put("serviceTags", response.getValue());
            stats.put("time", System.currentTimeMillis());
        } catch (Exception e) {
            log.warn("Could not retrieve Consul status: {}", e.getMessage());
            stats.put("error", e.getMessage());
        }
        return stats;
    }

    @Override
    public List<String> getReplicas() {
        List<String> peers = new ArrayList<>();
        try {
            // Consul LAN members can serve as peers for the registry UI
            Response<List<com.ecwid.consul.v1.agent.model.Member>> response = consulClient.getAgentMembers();
            for (com.ecwid.consul.v1.agent.model.Member member : response.getValue()) {
                if (member.isAlive()) {
                    peers.add(member.getName() + ":" + member.getTags().getOrDefault("port", "8300"));
                }
            }
        } catch (Exception e) {
            log.warn("Could not retrieve Consul members: {}", e.getMessage());
        }
        return peers;
    }

    @Override
    public boolean isActive() {
        try {
            consulClient.getAgentSelf();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String buildHomePageUrl(Service service) {
        String address = service.getAddress();
        if (address == null || address.isEmpty()) {
            return "";
        }
        return "http://" + address + ":" + service.getPort();
    }

    private String buildHealthCheckUrl(Service service) {
        String address = service.getAddress();
        if (address == null || address.isEmpty()) {
            return "";
        }
        return "http://" + address + ":" + service.getPort() + "/actuator/health";
    }
}
