package tech.jhipster.registry.service.discovery;

import java.lang.management.ManagementFactory;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.TreeSet;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;

/** Maps an explicitly selected Spring Cloud client to the existing Registry API. */
public class SpringCloudDiscoveryBackend implements RegistryDiscoveryBackend {

    private final String backend;

    private final DiscoveryClient client;

    private final String managementPath;

    public SpringCloudDiscoveryBackend(String backend, DiscoveryClient client, String managementPath) {
        if (!"consul".equals(backend) && !"kubernetes".equals(backend)) {
            throw new IllegalArgumentException("Expected consul or kubernetes discovery backend");
        }
        this.backend = backend;
        this.client = Objects.requireNonNull(client);
        this.managementPath = normalizePath(Objects.requireNonNull(managementPath));
    }

    @Override
    public List<Map<String, Object>> getApplications() {
        List<Map<String, Object>> applications = new ArrayList<>();
        for (String serviceId : new TreeSet<>(client.getServices())) {
            Map<String, Object> application = new LinkedHashMap<>();
            application.put("name", serviceId);
            TreeSet<String> configNames = new TreeSet<>();
            List<Map<String, Object>> instances = new ArrayList<>();
            for (ServiceInstance instance : client.getInstances(serviceId)) {
                Map<String, Object> mapped = mapInstance(serviceId, instance);
                instances.add(mapped);
                Map<String, String> metadata = instance.getMetadata();
                if (metadata != null && hasText(metadata.get("config-name"))) {
                    configNames.add(metadata.get("config-name"));
                }
            }
            instances.sort((left, right) -> ((String) left.get("instanceId")).compareTo((String) right.get("instanceId")));
            application.put("instances", instances);
            application.put("configName", configNames.size() == 1 ? configNames.first() : serviceId);
            applications.add(application);
        }
        return applications;
    }

    @Override
    public Map<String, Object> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("backend", backend);
        status.put("time", new Date());
        status.put("currentTime", Instant.now().toString());
        status.put("upTime", Duration.ofMillis(ManagementFactory.getRuntimeMXBean().getUptime()).toString());
        Runtime runtime = Runtime.getRuntime();
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
        String state = "UP";
        try {
            client.getServices();
        } catch (RuntimeException ex) {
            state = "DOWN";
            status.put("error", "Discovery backend is unavailable");
        }
        status.put("instanceInfo", Map.of("ipAddr", "Not reported", "status", state));
        return status;
    }

    @Override
    public List<String> getReplicas() {
        return List.of();
    }

    @Override
    public Map<String, Map<Long, String>> getLastN() {
        return Map.of("registered", Map.of(), "canceled", Map.of());
    }

    private Map<String, Object> mapInstance(String serviceId, ServiceInstance instance) {
        Map<String, String> metadata = new LinkedHashMap<>();
        if (instance.getMetadata() != null) {
            metadata.putAll(instance.getMetadata());
        }
        URI base = withContextPath(instance.getUri(), metadata.get("context-path"));
        String instanceId = instance.getInstanceId();
        if (!hasText(instanceId)) {
            instanceId = serviceId + ":" + instance.getHost() + ":" + instance.getPort();
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("instanceId", instanceId);
        result.put("homePageUrl", explicitOrDefault(metadata.get("homePageUrl"), base.toString()));
        result.put("healthCheckUrl", explicitOrDefault(metadata.get("healthCheckUrl"), managementUrl(base, metadata, "health")));
        result.put("statusPageUrl", explicitOrDefault(metadata.get("statusPageUrl"), managementUrl(base, metadata, "info")));
        for (String link : List.of("homePageUrl", "healthCheckUrl", "statusPageUrl")) {
            if (metadata.containsKey(link) && "".equals(result.get(link))) {
                // Rejected links must not reappear in the Instances metadata view.
                metadata.remove(link);
            }
        }
        // DiscoveryClient reports membership, not an individual instance's health.
        result.put("status", "UNKNOWN");
        result.put("metadata", metadata);
        return result;
    }

    private String managementUrl(URI base, Map<String, String> metadata, String endpoint) {
        String scheme = valueOrDefault(metadata.get("management.scheme"), base.getScheme());
        String host = valueOrDefault(metadata.get("management.address"), base.getHost());
        int port = base.getPort();
        if (hasText(metadata.get("management.port"))) {
            try {
                port = Integer.parseInt(metadata.get("management.port"));
                if (port < 1 || port > 65535) {
                    return "";
                }
            } catch (NumberFormatException ex) {
                return "";
            }
        }
        boolean separateManagementServer =
            port != base.getPort() && effectivePort(scheme, port) != effectivePort(base.getScheme(), base.getPort());
        separateManagementServer = separateManagementServer || !Objects.equals(host, base.getHost());
        String context = separateManagementServer || base.getPath() == null ? "" : normalizePath(base.getPath());
        String path = hasText(metadata.get("management.context-path"))
            ? normalizePath(metadata.get("management.context-path"))
            : context + managementPath;
        try {
            URI uri = new URI(scheme, null, host, port, path + "/" + endpoint, null, null);
            return isHttpUrl(uri) ? uri.toASCIIString() : "";
        } catch (URISyntaxException ex) {
            return "";
        }
    }

    private String explicitOrDefault(String explicit, String fallback) {
        String value = hasText(explicit) ? explicit : fallback;
        try {
            URI uri = new URI(value);
            return isHttpUrl(uri) ? uri.toASCIIString() : "";
        } catch (URISyntaxException ex) {
            return "";
        }
    }

    private URI withContextPath(URI base, String contextPath) {
        if (!hasText(contextPath)) {
            return base;
        }
        try {
            return new URI(base.getScheme(), base.getRawUserInfo(), base.getHost(), base.getPort(), normalizePath(contextPath), null, null);
        } catch (URISyntaxException ex) {
            throw new IllegalArgumentException("Invalid discovery instance context path", ex);
        }
    }

    private int effectivePort(String scheme, int port) {
        return port >= 0 ? port : "https".equalsIgnoreCase(scheme) ? 443 : 80;
    }

    private boolean isHttpUrl(URI uri) {
        return (
            ("http".equalsIgnoreCase(uri.getScheme()) || "https".equalsIgnoreCase(uri.getScheme())) &&
            uri.getHost() != null &&
            uri.getRawUserInfo() == null
        );
    }

    private static String normalizePath(String path) {
        String normalized = path.trim();
        while (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        return normalized.isEmpty() || normalized.startsWith("/") ? normalized : "/" + normalized;
    }

    private static String valueOrDefault(String value, String fallback) {
        return hasText(value) ? value : fallback;
    }

    private static boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
