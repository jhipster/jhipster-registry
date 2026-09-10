package tech.jhipster.registry.service;

import java.lang.management.ManagementFactory;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import tech.jhipster.registry.config.ApplicationProperties;

/** Adapt read-only Spring discovery data to the Registry UI's existing response shapes. */
public final class DiscoveryView {

    private final DiscoveryClient client;
    private final String provider;
    private final ApplicationProperties properties;

    public DiscoveryView(DiscoveryClient client, String provider, ApplicationProperties properties) {
        this.client = client;
        this.provider = provider;
        this.properties = properties;
    }

    public List<Map<String, Object>> applications() {
        try {
            List<Map<String, Object>> applications = new ArrayList<>();
            for (String serviceId : new TreeSet<>(client.getServices())) {
                List<Map<String, Object>> instances = new ArrayList<>();
                for (ServiceInstance instance : client.getInstances(serviceId)) {
                    instances.add(instance(instance));
                }
                Map<String, Object> application = new LinkedHashMap<>();
                application.put("name", serviceId);
                // External instance IDs are opaque and need not contain the Spring application name.
                application.put("configName", serviceId);
                application.put("instances", instances);
                applications.add(application);
            }
            return applications;
        } catch (RuntimeException exception) {
            // An unavailable catalog is different from an empty catalog. Do not silently hide discovery outages.
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Unable to read " + provider + " discovery", exception);
        }
    }

    private Map<String, Object> instance(ServiceInstance service) {
        Map<String, String> metadata = service.getMetadata();
        String base = service.getUri().toString().replaceAll("/+$", "");
        String context = path(metadata.getOrDefault("context-path", ""));
        String management = path(metadata.getOrDefault("management.context-path", "/management"));
        Map<String, Object> instance = new LinkedHashMap<>();
        instance.put("instanceId", service.getInstanceId() == null ? service.getServiceId() + "@" + base : service.getInstanceId());
        instance.put("homePageUrl", metadata.getOrDefault("homePageUrl", base + context + "/"));
        instance.put("healthCheckUrl", metadata.getOrDefault("healthCheckUrl", base + context + management + "/health"));
        instance.put("statusPageUrl", metadata.getOrDefault("statusPageUrl", base + context + management + "/info"));
        // DiscoveryClient supplies locations, not a portable health state. Do not label every discovered instance UP.
        instance.put("status", "UNKNOWN");
        instance.put("metadata", metadata);
        return instance;
    }

    private String path(String value) {
        String trimmed = value.replaceAll("^/+|/+$", "");
        return trimmed.isEmpty() ? "" : "/" + trimmed;
    }

    public Map<String, Object> status() {
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> status = new LinkedHashMap<>();
        Date now = new Date();
        status.put("time", now);
        status.put("currentTime", now.toString());
        status.put("upTime", Duration.ofMillis(ManagementFactory.getRuntimeMXBean().getUptime()).toString());
        status.put("environment", properties.getEureka().getEnvironment());
        status.put("datacenter", properties.getEureka().getDatacenter());
        status.put("discoveryProvider", provider);
        status.put("isBelowRenewThreshold", false);
        status.put(
            "generalStats",
            Map.of(
                "total-avail-memory",
                runtime.maxMemory() / (1024 * 1024) + " MB",
                "current-memory-usage",
                (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024) + " MB",
                "num-of-cpus",
                runtime.availableProcessors()
            )
        );
        // These describe this running Registry JVM, not the health of remote instances or the discovery server.
        status.put("instanceInfo", Map.of("ipAddr", localAddress(), "status", "UP"));
        return status;
    }

    private String localAddress() {
        try {
            return InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException exception) {
            return "unknown";
        }
    }
}
