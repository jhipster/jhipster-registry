package tech.jhipster.registry.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.cloud.client.DefaultServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.server.ResponseStatusException;
import tech.jhipster.registry.config.ApplicationProperties;

class DiscoveryViewTest {

    private final DiscoveryClient client = mock(DiscoveryClient.class);
    private final DiscoveryView view = new DiscoveryView(client, "consul", new ApplicationProperties());

    @Test
    void preservesServiceNamesAndSortsADeduplicatedCatalogIncludingEmptyServices() {
        when(client.getServices()).thenReturn(List.of("zebra", "orders", "orders"));
        when(client.getInstances("orders")).thenReturn(List.of());
        when(client.getInstances("zebra")).thenReturn(List.of());
        assertThat(view.applications())
            .containsExactly(
                Map.of("name", "orders", "configName", "orders", "instances", List.of()),
                Map.of("name", "zebra", "configName", "zebra", "instances", List.of())
            );
        when(client.getServices()).thenReturn(List.of());
        assertThat(view.applications()).isEmpty();
    }

    @Test
    @SuppressWarnings("unchecked")
    void mapsSecureAddressesMetadataAndManagementPathsWithoutInventingHealth() {
        when(client.getServices()).thenReturn(List.of("orders"));
        DefaultServiceInstance service = new DefaultServiceInstance(null, "orders", "orders.internal", 8443, true);
        service.getMetadata().putAll(Map.of("context-path", "/shop/", "management.context-path", "/admin/"));
        when(client.getInstances("orders")).thenReturn(List.of(service));
        Map<String, Object> instance = ((List<Map<String, Object>>) view.applications().get(0).get("instances")).get(0);
        assertThat(instance)
            .containsAllEntriesOf(
                Map.of(
                    "instanceId",
                    "orders@https://orders.internal:8443",
                    "homePageUrl",
                    "https://orders.internal:8443/shop/",
                    "healthCheckUrl",
                    "https://orders.internal:8443/shop/admin/health",
                    "statusPageUrl",
                    "https://orders.internal:8443/shop/admin/info",
                    "status",
                    "UNKNOWN",
                    "metadata",
                    service.getMetadata()
                )
            );
        service
            .getMetadata()
            .putAll(
                Map.of(
                    "homePageUrl",
                    "https://orders.example.org/",
                    "healthCheckUrl",
                    "https://management.example.org/ready",
                    "statusPageUrl",
                    "https://management.example.org/info"
                )
            );
        instance = ((List<Map<String, Object>>) view.applications().get(0).get("instances")).get(0);
        assertThat(instance)
            .containsEntry("homePageUrl", "https://orders.example.org/")
            .containsEntry("healthCheckUrl", "https://management.example.org/ready")
            .containsEntry("statusPageUrl", "https://management.example.org/info");
    }

    @Test
    void reportsUnavailableDiscoveryInsteadOfAnEmptySuccessfulCatalog() {
        when(client.getServices()).thenThrow(new IllegalStateException("discovery is unavailable"));
        assertThatThrownBy(view::applications)
            .isInstanceOf(ResponseStatusException.class)
            .satisfies(exception -> assertThat(((ResponseStatusException) exception).getRawStatusCode()).isEqualTo(503));
    }
}
