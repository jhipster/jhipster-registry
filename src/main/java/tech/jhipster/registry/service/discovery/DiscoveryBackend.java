package tech.jhipster.registry.service.discovery;

import java.util.List;
import java.util.Map;

/**
 * Abstraction for service discovery backends.
 * Implementations retrieve service instances from different discovery systems
 * such as Eureka, Consul, and Kubernetes.
 */
public interface DiscoveryBackend {

    /**
     * @return the unique name of this discovery backend (e.g. "eureka", "consul", "kubernetes")
     */
    String getName();

    /**
     * @return list of registered applications with their instances
     */
    List<Map<String, Object>> getApplications();

    /**
     * @return status information about the discovery backend, or null if not applicable
     */
    Map<String, Object> getStatus();

    /**
     * @return list of replica/peer addresses, or empty list if not applicable
     */
    List<String> getReplicas();

    /**
     * @return true if this backend is currently active and available
     */
    boolean isActive();
}
