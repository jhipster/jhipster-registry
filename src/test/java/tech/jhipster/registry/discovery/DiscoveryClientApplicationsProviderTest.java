package tech.jhipster.registry.discovery;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.cloud.client.DefaultServiceInstance;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;

/**
 * Unit tests for the {@link DiscoveryClientApplicationsProvider}.
 */
class DiscoveryClientApplicationsProviderTest {

    private static final String MICROSERVICE = "jhipsterSampleMicroservice";

    private static final String GATEWAY = "jhipsterGateway";

    private final StubDiscoveryClient discoveryClient = new StubDiscoveryClient();

    private final DiscoveryClientApplicationsProvider applicationsProvider = new DiscoveryClientApplicationsProvider(discoveryClient);

    @Test
    void shouldGetApplicationsAndTheirInstancesSortedByNameAndInstanceId() {
        discoveryClient.addInstance(MICROSERVICE, serviceInstance(MICROSERVICE + ":2", 8082));
        discoveryClient.addInstance(MICROSERVICE, serviceInstance(MICROSERVICE + ":1", 8081));
        discoveryClient.addInstance(GATEWAY, serviceInstance(GATEWAY + ":1", 8080));

        List<RegistryApplication> applications = applicationsProvider.getApplications();

        assertThat(applications).extracting(RegistryApplication::getName).containsExactly(GATEWAY, MICROSERVICE);
        assertThat(applications.get(1).getInstances())
            .extracting(RegistryInstance::getInstanceId)
            .containsExactly(MICROSERVICE + ":1", MICROSERVICE + ":2");
    }

    @Test
    void shouldGetUpInstancesWithTheirAddressAndManagementUrls() {
        discoveryClient.addInstance(MICROSERVICE, serviceInstance(MICROSERVICE + ":1", 8081, Map.of("version", "1.0.0")));

        RegistryInstance instance = getFirstInstance(MICROSERVICE);

        assertThat(instance.getInstanceId()).isEqualTo(MICROSERVICE + ":1");
        assertThat(instance.getHomePageUrl()).isEqualTo("http://localhost:8081");
        assertThat(instance.getHealthCheckUrl()).isEqualTo("http://localhost:8081/management/health");
        assertThat(instance.getStatusPageUrl()).isEqualTo("http://localhost:8081/management/info");
        assertThat(instance.getStatus()).isEqualTo("UP");
        assertThat(instance.getMetadata()).containsEntry("version", "1.0.0");
    }

    @Test
    void shouldGetUrlsFromInstanceMetadataWhenProvided() {
        Map<String, String> metadata = new LinkedHashMap<>();
        metadata.put(DiscoveryClientApplicationsProvider.HOME_PAGE_URL_METADATA_KEY, "https://jhipster-sample-microservice.example.com");
        metadata.put(
            DiscoveryClientApplicationsProvider.HEALTH_CHECK_URL_METADATA_KEY,
            "https://jhipster-sample-microservice.example.com/health"
        );
        metadata.put(
            DiscoveryClientApplicationsProvider.STATUS_PAGE_URL_METADATA_KEY,
            "https://jhipster-sample-microservice.example.com/info"
        );
        discoveryClient.addInstance(MICROSERVICE, serviceInstance(MICROSERVICE + ":1", 8081, metadata));

        RegistryInstance instance = getFirstInstance(MICROSERVICE);

        assertThat(instance.getHomePageUrl()).isEqualTo("https://jhipster-sample-microservice.example.com");
        assertThat(instance.getHealthCheckUrl()).isEqualTo("https://jhipster-sample-microservice.example.com/health");
        assertThat(instance.getStatusPageUrl()).isEqualTo("https://jhipster-sample-microservice.example.com/info");
    }

    @Test
    void shouldGetInstanceAddressAsInstanceIdWhenTheDiscoveryBackendDoesNotProvideOne() {
        discoveryClient.addInstance(MICROSERVICE, new DefaultServiceInstance(null, MICROSERVICE, "localhost", 8081, false));

        assertThat(getFirstInstance(MICROSERVICE).getInstanceId()).isEqualTo("localhost:8081");
    }

    @Test
    void shouldGetApplicationWithoutInstance() {
        discoveryClient.addService(MICROSERVICE);

        List<RegistryApplication> applications = applicationsProvider.getApplications();

        assertThat(applications).extracting(RegistryApplication::getName).containsExactly(MICROSERVICE);
        assertThat(applications.get(0).getInstances()).isEmpty();
    }

    private RegistryInstance getFirstInstance(String applicationName) {
        return applicationsProvider
            .getApplications()
            .stream()
            .filter(application -> application.getName().equals(applicationName))
            .findFirst()
            .flatMap(application -> application.getInstances().stream().findFirst())
            .orElseThrow();
    }

    private DefaultServiceInstance serviceInstance(String instanceId, int port) {
        return serviceInstance(instanceId, port, new LinkedHashMap<>());
    }

    private DefaultServiceInstance serviceInstance(String instanceId, int port, Map<String, String> metadata) {
        return new DefaultServiceInstance(instanceId, instanceId.substring(0, instanceId.indexOf(':')), "localhost", port, false, metadata);
    }

    /**
     * Discovery client returning the services declared with it, like Consul and Kubernetes do with the services
     * registered in their own registry.
     */
    private static final class StubDiscoveryClient implements DiscoveryClient {

        private final Map<String, List<ServiceInstance>> instances = new LinkedHashMap<>();

        private void addService(String serviceId) {
            instances.computeIfAbsent(serviceId, key -> new ArrayList<>());
        }

        private void addInstance(String serviceId, ServiceInstance instance) {
            addService(serviceId);
            instances.get(serviceId).add(instance);
        }

        @Override
        public String description() {
            return "Stub Discovery Client";
        }

        @Override
        public List<ServiceInstance> getInstances(String serviceId) {
            return instances.getOrDefault(serviceId, new ArrayList<>());
        }

        @Override
        public List<String> getServices() {
            return new ArrayList<>(instances.keySet());
        }
    }
}
