package tech.jhipster.registry.service.discovery;

import com.ecwid.consul.v1.ConsulClient;
import com.ecwid.consul.v1.Response;
import com.ecwid.consul.v1.health.model.HealthService;
import java.util.ArrayList;
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
@ConditionalOnProperty(name = "application.discovery.backend", havingValue = "consul")
public class ConsulDiscoveryService implements DiscoveryService {

    private final Logger log = LoggerFactory.getLogger(ConsulDiscoveryService.class);

    private final ApplicationProperties applicationProperties;

    private final ConsulClient consulClient;

    public ConsulDiscoveryService(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
        String host = applicationProperties.getConsul().getHost();
        int port = applicationProperties.getConsul().getPort();
        this.consulClient = new ConsulClient(host, port);
        log.info("Consul discovery service initialized with {}:{}", host, port);
    }

    @Override
    public String getBackendType() {
        return "consul";
    }

    @Override
    public List<Map<String, Object>> getApplications() {
        List<Map<String, Object>> apps = new ArrayList<>();
        try {
            Response<Map<String, List<String>>> services = consulClient.getAgentServices();
            Map<String, List<String>> serviceMap = services.getValue();
            for (Map.Entry<String, List<String>> entry : serviceMap.entrySet()) {
                Map<String, Object> appData = new LinkedHashMap<>();
                appData.put("name", entry.getKey());
                List<Map<String, Object>> instances = new ArrayList<>();
                Response<List<HealthService>> healthServices = consulClient.getHealthServices(
                    entry.getKey(),
                    true,
                    null
                );
                for (HealthService healthService : healthServices.getValue()) {
                    Map<String, Object> instance = new HashMap<>();
                    HealthService.Service service = healthService.getService();
                    instance.put("instanceId", service.getId());
                    instance.put("homePageUrl", buildHomePageUrl(service));
                    instance.put("status", healthService.getChecks().stream().allMatch(c -> "passing".equals(c.getStatus())) ? "UP" : "DOWN");
                    instance.put("metadata", service.getMeta());
                    instances.add(instance);
                }
                appData.put("instances", instances);
                apps.add(appData);
            }
        } catch (Exception e) {
            log.error("Failed to fetch applications from Consul: {}", e.getMessage());
        }
        return apps;
    }

    @Override
    public Map<String, Object> getStatus() {
        Map<String, Object> stats = new HashMap<>();
        try {
            Response<Map<String, String>> self = consulClient.getAgentSelf();
            Map<String, String> selfInfo = self.getValue();
            stats.put("backend", "consul");
            stats.putAll(selfInfo);
        } catch (Exception e) {
            log.error("Failed to fetch Consul status: {}", e.getMessage());
            stats.put("error", e.getMessage());
        }
        return stats;
    }

    @Override
    public List<String> getReplicas() {
        List<String> replicas = new ArrayList<>();
        try {
            Response<List<Map<String, Object>>> peers = consulClient.getStatusPeers();
            for (Map<String, Object> peer : peers.getValue()) {
                replicas.add(peer.toString());
            }
        } catch (Exception e) {
            log.error("Failed to fetch Consul peers: {}", e.getMessage());
        }
        return replicas;
    }

    @Override
    public Map<String, Map<Long, String>> getLastN() {
        return new HashMap<>();
    }

    private String buildHomePageUrl(HealthService.Service service) {
        String address = service.getAddress();
        int port = service.getPort();
        if (address != null && port > 0) {
            return "http://" + address + ":" + port;
        }
        return "";
    }
}
