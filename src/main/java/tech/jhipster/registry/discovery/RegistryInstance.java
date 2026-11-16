package tech.jhipster.registry.discovery;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * An instance of an application registered in the discovery backend used by the Registry.
 */
public class RegistryInstance {

    private String instanceId;

    private String homePageUrl;

    private String healthCheckUrl;

    private String statusPageUrl;

    private String status;

    private Map<String, String> metadata = new LinkedHashMap<>();

    public RegistryInstance() {}

    public RegistryInstance(
        String instanceId,
        String homePageUrl,
        String healthCheckUrl,
        String statusPageUrl,
        String status,
        Map<String, String> metadata
    ) {
        this.instanceId = instanceId;
        this.homePageUrl = homePageUrl;
        this.healthCheckUrl = healthCheckUrl;
        this.statusPageUrl = statusPageUrl;
        this.status = status;
        setMetadata(metadata);
    }

    public String getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }

    public String getHomePageUrl() {
        return homePageUrl;
    }

    public void setHomePageUrl(String homePageUrl) {
        this.homePageUrl = homePageUrl;
    }

    public String getHealthCheckUrl() {
        return healthCheckUrl;
    }

    public void setHealthCheckUrl(String healthCheckUrl) {
        this.healthCheckUrl = healthCheckUrl;
    }

    public String getStatusPageUrl() {
        return statusPageUrl;
    }

    public void setStatusPageUrl(String statusPageUrl) {
        this.statusPageUrl = statusPageUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata != null ? new LinkedHashMap<>(metadata) : new LinkedHashMap<>();
    }
}
