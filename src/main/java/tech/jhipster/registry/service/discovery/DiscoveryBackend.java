package tech.jhipster.registry.service.discovery;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Abstraction for service discovery backends.
 * <p>
 * Implementations retrieve service instances from different discovery systems
 * such as Eureka, Consul, and Kubernetes. Each backend is conditionally
 * registered based on the classpath and active Spring profiles.
 *
 * @see EurekaDiscoveryBackend
 * @see ConsulDiscoveryBackend
 * @see KubernetesDiscoveryBackend
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
     * @return status information about the discovery backend
     */
    Map<String, Object> getStatus();

    /**
     * @return list of replica/peer addresses, or empty list if not applicable
     */
    List<String> getReplicas();

    /**
     * @return the registration/event history, if supported
     */
    default Optional<Map<String, Map<Long, String>>> getHistory() {
        return Optional.empty();
    }

    /**
     * @return true if this backend is currently active and available
     */
    boolean isActive();
}
