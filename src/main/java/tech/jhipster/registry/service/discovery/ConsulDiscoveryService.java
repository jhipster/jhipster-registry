package tech.jhipster.registry.service.discovery;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("consul")
public class ConsulDiscoveryService implements DiscoveryService {

    private final Logger log = LoggerFactory.getLogger(ConsulDiscoveryService.class);

    private final DiscoveryClient discoveryClient;

    public ConsulDiscoveryService(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    @Override
    public List<Map<String, Object>> getApplications() {
        List<Map<String, Object>> apps = new ArrayList<>();
        for (String serviceId : discoveryClient.getServices()) {
            LinkedHashMap<String, Object> appData = new LinkedHashMap<>();
            appData.put("name", serviceId.toUpperCase());
            List<Map<String, Object>> instances = new ArrayList<>();
            for (ServiceInstance instance : discoveryClient.getInstances(serviceId)) {
                Map<String, Object> inst = new HashMap<>();
                inst.put("instanceId", instance.getInstanceId());
                inst.put("homePageUrl", instance.getUri().toString());
                inst.put("healthCheckUrl", instance.getUri().toString() + "/actuator/health");
                inst.put("statusPageUrl", instance.getUri().toString() + "/actuator/info");
                inst.put("status", "UP");
                inst.put("metadata", instance.getMetadata());
                instances.add(inst);
            }
            appData.put("instances", instances);
            apps.add(appData);
        }
        return apps;
    }

    @Override
    public Map<String, Map<Long, String>> getHistory() {
        Map<String, Map<Long, String>> lastn = new HashMap<>();
        lastn.put("canceled", new HashMap<>());
        lastn.put("registered", new HashMap<>());
        return lastn;
    }

    @Override
    public List<String> getReplicas() {
        List<String> replicas = new ArrayList<>();
        List<ServiceInstance> instances = discoveryClient.getInstances("consul");
        replicas.addAll(
            instances.stream().map(i -> i.getHost() + ":" + i.getPort()).collect(Collectors.toList())
        );
        if (replicas.isEmpty()) {
            replicas.add("consul-agent");
        }
        return replicas;
    }

    @Override
    public Map<String, Object> getStatus() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("time", new Date());
        stats.put("currentTime", new Date().toString());
        stats.put("upTime", ProcessHandle.current().info().totalCpuDuration().orElse(Duration.ZERO).getSeconds() + "s");
        stats.put("environment", "Consul");
        stats.put("datacenter", "dc1");
        stats.put("isBelowRenewThreshold", false);
        stats.put("discoveryBackend", "consul");

        Map<String, Object> generalStats = new HashMap<>();
        generalStats.put("num-of-cpus", Runtime.getRuntime().availableProcessors());
        generalStats.put("total-avail-memory", Runtime.getRuntime().totalMemory());
        generalStats.put("current-memory-usage", Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory());

        Map<String, String> instanceInfo = new HashMap<>();
        try {
            instanceInfo.put("ipAddr", java.net.InetAddress.getLocalHost().getHostAddress());
        } catch (Exception e) {
            instanceInfo.put("ipAddr", "unknown");
        }
        instanceInfo.put("status", "UP");

        stats.put("generalStats", generalStats);
        stats.put("instanceInfo", instanceInfo);
        return stats;
    }
}
