package tech.jhipster.registry.service.discovery;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import java.net.URI;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.cloud.client.DefaultServiceInstance;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;

class SpringCloudDiscoveryBackendTest {

    private final DiscoveryClient client = mock(DiscoveryClient.class);

    private final SpringCloudDiscoveryBackend backend = new SpringCloudDiscoveryBackend("consul", client, "/management");

    @Test
    void mapsRealMembershipWithStableOrderingAndUnknownHealth() {
        when(client.getServices()).thenReturn(List.of("orders", "billing", "orders"));
        when(client.getInstances("billing")).thenReturn(List.of());
        when(client.getInstances("orders"))
            .thenReturn(
                List.of(
                    new DefaultServiceInstance("second", "orders", "two.example", 8080, false, Map.of("status", "UP")),
                    new DefaultServiceInstance("first", "orders", "one.example", 443, true, Map.of())
                )
            );

        List<Map<String, Object>> applications = backend.getApplications();

        assertThat(applications).extracting(application -> application.get("name")).containsExactly("billing", "orders");
        assertThat(applications.get(0).get("instances")).isEqualTo(List.of());
        List<Map<String, Object>> instances = instances(applications.get(1));
        assertThat(instances).extracting(instance -> instance.get("instanceId")).containsExactly("first", "second");
        assertThat(instances).extracting(instance -> instance.get("status")).containsOnly("UNKNOWN");
        assertThat(instances.get(0).get("homePageUrl")).isEqualTo("https://one.example:443");
        assertThat(instances.get(0).get("healthCheckUrl")).isEqualTo("https://one.example:443/management/health");
        verify(client, times(1)).getInstances("orders");
    }

    @Test
    void preservesAnEmptySuccessfulRegistry() {
        when(client.getServices()).thenReturn(List.of());
        assertThat(backend.getApplications()).isEmpty();
        assertThat(backend.getStatus()).doesNotContainKey("error").containsEntry("backend", "consul");
    }

    @Test
    void doesNotHideProviderFailureAsAnEmptyRegistry() {
        RuntimeException failure = new IllegalStateException("connection refused");
        when(client.getServices()).thenThrow(failure);
        assertThatThrownBy(backend::getApplications).isSameAs(failure);
        Map<String, Object> status = backend.getStatus();
        assertThat(status.get("error")).isEqualTo("Discovery backend is unavailable");
        assertThat(((Map<?, ?>) status.get("instanceInfo")).get("status")).isEqualTo("DOWN");
    }

    @Test
    void doesNotExposeProviderExceptionCredentialsInStatus() {
        when(client.getServices()).thenThrow(new IllegalStateException("https://secret-token@private.example"));
        assertThat(backend.getStatus().toString()).doesNotContain("secret-token", "private.example");
    }

    @Test
    void retainsNonNullStatusObjectsUsedByHomeTemplate() {
        when(client.getServices()).thenReturn(List.of());
        Map<String, Object> status = backend.getStatus();
        assertThat((Map<?, ?>) status.get("generalStats")).isNotEmpty();
        assertThat(((Map<?, ?>) status.get("instanceInfo")).get("status")).isEqualTo("UP");
        assertThat(status).containsKeys("time", "currentTime", "upTime");
        assertThat(status).doesNotContainKey("isBelowRenewThreshold");
    }

    @Test
    void mapsContextPathTlsAndSeparateManagementPort() {
        ServiceInstance instance = instanceWithUri(
            "https://app.example:8443/shop/",
            Map.of("management.port", "9443", "management.context-path", "/operations")
        );
        Map<String, Object> mapped = mapOnly(instance);
        assertThat(mapped.get("healthCheckUrl")).isEqualTo("https://app.example:9443/operations/health");
        assertThat(mapped.get("statusPageUrl")).isEqualTo("https://app.example:9443/operations/info");
    }

    @Test
    void appendsDefaultManagementPathToApplicationContext() {
        Map<String, Object> mapped = mapOnly(instanceWithUri("https://app.example/shop/", Map.of()));
        assertThat(mapped.get("healthCheckUrl")).isEqualTo("https://app.example/shop/management/health");
    }

    @Test
    void respectsAdvertisedApplicationContextMetadata() {
        Map<String, Object> mapped = mapOnly(instanceWithUri("https://app.example", Map.of("context-path", "/shop/")));
        assertThat(mapped.get("homePageUrl")).isEqualTo("https://app.example/shop");
        assertThat(mapped.get("healthCheckUrl")).isEqualTo("https://app.example/shop/management/health");
    }

    @Test
    void separateManagementPortDoesNotInheritApplicationContext() {
        Map<String, Object> mapped = mapOnly(instanceWithUri("https://app.example:8443/shop", Map.of("management.port", "9443")));
        assertThat(mapped.get("homePageUrl")).isEqualTo("https://app.example:8443/shop");
        assertThat(mapped.get("healthCheckUrl")).isEqualTo("https://app.example:9443/management/health");
    }

    @Test
    void explicitlyRestatedDefaultPortKeepsApplicationContext() {
        Map<String, Object> mapped = mapOnly(instanceWithUri("https://app.example/shop", Map.of("management.port", "443")));
        assertThat(mapped.get("healthCheckUrl")).isEqualTo("https://app.example:443/shop/management/health");
    }

    @Test
    void respectsExplicitAdvertisedHealthAndStatusUrls() {
        Map<String, Object> mapped = mapOnly(
            instanceWithUri(
                "http://app.example:8080",
                Map.of("healthCheckUrl", "https://health.example/ready", "statusPageUrl", "https://health.example/info")
            )
        );
        assertThat(mapped.get("healthCheckUrl")).isEqualTo("https://health.example/ready");
        assertThat(mapped.get("statusPageUrl")).isEqualTo("https://health.example/info");
    }

    @Test
    void omitsUnsafeAdvertisedLinksAndInvalidManagementPort() {
        Map<String, Object> mapped = mapOnly(
            instanceWithUri("http://app.example:8080", Map.of("homePageUrl", "javascript:alert(1)", "management.port", "-1"))
        );
        assertThat(mapped.get("homePageUrl")).isEqualTo("");
        assertThat(mapped.get("healthCheckUrl")).isEqualTo("");
        assertThat(mapped.toString()).doesNotContain("javascript:alert");
        Map<String, String> originalMetadata = Map.of("statusPageUrl", "https://user:password@host/info", "version", "1.0");
        mapped = mapOnly(instanceWithUri("http://app.example", originalMetadata));
        assertThat(mapped.get("statusPageUrl")).isEqualTo("");
        assertThat(mapped.toString()).doesNotContain("user:password");
        assertThat(mapped.get("metadata")).isEqualTo(Map.of("version", "1.0"));
        assertThat(originalMetadata).containsKey("statusPageUrl");
    }

    @Test
    void providesStringFallbackIdAndNonNullMetadata() {
        ServiceInstance instance = instanceWithUri("http://app.example:8080", null);
        when(instance.getInstanceId()).thenReturn(null);
        Map<String, Object> mapped = mapOnly(instance);
        assertThat(mapped.get("instanceId")).isEqualTo("orders:app.example:8080");
        assertThat(mapped.get("metadata")).isEqualTo(Map.of());
    }

    @Test
    void passesExplicitConfigurationNameWithoutParsingOpaqueInstanceId() {
        mapOnly(new DefaultServiceInstance("10.0.0.1:8080", "orders", "app.example", 8080, false, Map.of("config-name", "OrderService")));
        assertThat(backend.getApplications().get(0).get("configName")).isEqualTo("OrderService");
    }

    @Test
    void usesServiceNameWhenInstancesHaveConflictingConfigurationNames() {
        when(client.getServices()).thenReturn(List.of("orders"));
        when(client.getInstances("orders"))
            .thenReturn(
                List.of(
                    new DefaultServiceInstance("one", "orders", "one", 80, false, Map.of("config-name", "first")),
                    new DefaultServiceInstance("two", "orders", "two", 80, false, Map.of("config-name", "second"))
                )
            );
        assertThat(backend.getApplications().get(0).get("configName")).isEqualTo("orders");
    }

    @Test
    void providesNonApplicableEurekaHistoryWithoutContactingAProvider() {
        assertThat(backend.getReplicas()).isEmpty();
        assertThat(backend.getLastN()).isEqualTo(Map.of("registered", Map.of(), "canceled", Map.of()));
        verifyNoInteractions(client);
    }

    @Test
    void requiresAnExplicitSupportedBackend() {
        assertThatThrownBy(() -> new SpringCloudDiscoveryBackend("eureka", client, "/management"))
            .isInstanceOf(IllegalArgumentException.class);
        SpringCloudDiscoveryBackend kubernetes = new SpringCloudDiscoveryBackend("kubernetes", client, "/management");
        when(client.getServices()).thenReturn(List.of());
        assertThat(kubernetes.getStatus()).containsEntry("backend", "kubernetes");
    }

    private Map<String, Object> mapOnly(ServiceInstance instance) {
        when(client.getServices()).thenReturn(List.of("orders"));
        when(client.getInstances("orders")).thenReturn(List.of(instance));
        return instances(backend.getApplications().get(0)).get(0);
    }

    private ServiceInstance instanceWithUri(String uriValue, Map<String, String> metadata) {
        URI uri = URI.create(uriValue);
        ServiceInstance instance = mock(ServiceInstance.class);
        when(instance.getUri()).thenReturn(uri);
        when(instance.getInstanceId()).thenReturn("opaque-id");
        when(instance.getHost()).thenReturn(uri.getHost());
        when(instance.getPort()).thenReturn(uri.getPort());
        when(instance.getMetadata()).thenReturn(metadata);
        return instance;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> instances(Map<String, Object> application) {
        return (List<Map<String, Object>>) application.get("instances");
    }
}
