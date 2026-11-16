package tech.jhipster.registry.discovery;

import java.net.URI;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.util.StringUtils;

/**
 * Provides the applications registered in the discovery backend available through the {@link DiscoveryClient} of the
 * application, such as Consul or Kubernetes.
 * <p>
 * The instances returned by the discovery client are the ones the backend considers available: Consul lists the
 * instances passing their health checks and Kubernetes the ready endpoints. They are therefore reported as {@code UP}.
 */
public class DiscoveryClientApplicationsProvider implements ApplicationsProvider {

    /**
     * Instance metadata keys used to override the URLs computed from the instance URI.
     */
    static final String HOME_PAGE_URL_METADATA_KEY = "homePageUrl";

    static final String HEALTH_CHECK_URL_METADATA_KEY = "healthCheckUrl";

    static final String STATUS_PAGE_URL_METADATA_KEY = "statusPageUrl";

    private static final String MANAGEMENT_HEALTH_PATH = "/management/health";

    private static final String MANAGEMENT_INFO_PATH = "/management/info";

    private static final String UP = "UP";

    private final DiscoveryClient discoveryClient;

    public DiscoveryClientApplicationsProvider(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    @Override
    public List<RegistryApplication> getApplications() {
        List<RegistryApplication> applications = new ArrayList<>();
        discoveryClient.getServices().stream().sorted().forEach(serviceId -> applications.add(toRegistryApplication(serviceId)));
        return applications;
    }

    private RegistryApplication toRegistryApplication(String serviceId) {
        RegistryApplication application = new RegistryApplication(serviceId);
        discoveryClient
            .getInstances(serviceId)
            .stream()
            .sorted(Comparator.comparing(this::instanceId))
            .forEach(instance -> application.getInstances().add(toRegistryInstance(instance)));
        return application;
    }

    private RegistryInstance toRegistryInstance(ServiceInstance instance) {
        URI uri = instance.getUri();
        Map<String, String> metadata = instance.getMetadata();
        return new RegistryInstance(
            instanceId(instance),
            metadataValue(metadata, HOME_PAGE_URL_METADATA_KEY, uri.toString()),
            metadataValue(metadata, HEALTH_CHECK_URL_METADATA_KEY, uri.resolve(MANAGEMENT_HEALTH_PATH).toString()),
            metadataValue(metadata, STATUS_PAGE_URL_METADATA_KEY, uri.resolve(MANAGEMENT_INFO_PATH).toString()),
            UP,
            metadata
        );
    }

    /**
     * Discovery backends are not required to provide an instance identifier, Kubernetes uses the pod UID and Consul the
     * service ID. When it is missing, the instance address is used instead.
     */
    private String instanceId(ServiceInstance instance) {
        String instanceId = instance.getInstanceId();
        return StringUtils.hasText(instanceId) ? instanceId : instance.getHost() + ":" + instance.getPort();
    }

    private String metadataValue(Map<String, String> metadata, String key, String defaultValue) {
        return metadata != null && StringUtils.hasText(metadata.get(key)) ? metadata.get(key) : defaultValue;
    }
}
