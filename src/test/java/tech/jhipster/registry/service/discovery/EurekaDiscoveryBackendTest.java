package tech.jhipster.registry.service.discovery;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.shared.Application;
import com.netflix.discovery.shared.Pair;
import com.netflix.eureka.EurekaServerContext;
import com.netflix.eureka.cluster.PeerEurekaNode;
import com.netflix.eureka.cluster.PeerEurekaNodes;
import com.netflix.eureka.registry.PeerAwareInstanceRegistryImpl;
import com.netflix.eureka.util.StatusInfo;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import tech.jhipster.registry.config.ApplicationProperties;

class EurekaDiscoveryBackendTest {

    private final ApplicationProperties properties = new ApplicationProperties();

    private final EurekaServerContext context = mock(EurekaServerContext.class);

    private final PeerAwareInstanceRegistryImpl registry = mock(PeerAwareInstanceRegistryImpl.class);

    private final StatusInfo statusInfo = mock(StatusInfo.class);

    private final EurekaDiscoveryBackend backend = new EurekaDiscoveryBackend(properties, () -> context, () -> statusInfo);

    @BeforeEach
    void setUp() {
        when(context.getRegistry()).thenReturn(registry);
    }

    @Test
    void retainsEurekaInstanceFieldsAndLegacyConfigurationName() {
        Application application = mock(Application.class);
        InstanceInfo instance = mock(InstanceInfo.class);
        when(application.getName()).thenReturn("ORDERS");
        when(application.getInstances()).thenReturn(List.of(instance));
        when(instance.getInstanceId()).thenReturn("orderService:12345");
        when(instance.getHomePageUrl()).thenReturn("https://orders.example/");
        when(instance.getHealthCheckUrl()).thenReturn("https://orders.example/management/health");
        when(instance.getStatusPageUrl()).thenReturn("https://orders.example/management/info");
        when(instance.getStatus()).thenReturn(InstanceInfo.InstanceStatus.OUT_OF_SERVICE);
        when(instance.getMetadata()).thenReturn(Map.of("version", "1"));
        when(registry.getSortedApplications()).thenReturn(List.of(application));

        Map<String, Object> result = backend.getApplications().get(0);
        assertThat(result).containsEntry("name", "ORDERS").containsEntry("configName", "orderService");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> instances = (List<Map<String, Object>>) result.get("instances");
        assertThat(instances.get(0))
            .containsEntry("instanceId", "orderService:12345")
            .containsEntry("status", "OUT_OF_SERVICE")
            .containsEntry("healthCheckUrl", "https://orders.example/management/health")
            .containsEntry("metadata", Map.of("version", "1"));
    }

    @Test
    void toleratesAnApplicationWithoutInstances() {
        Application application = mock(Application.class);
        when(application.getName()).thenReturn("ORDERS");
        when(application.getInstances()).thenReturn(List.of());
        when(registry.getSortedApplications()).thenReturn(List.of(application));
        assertThat(backend.getApplications().get(0)).containsEntry("configName", "orders").containsEntry("instances", List.of());
    }

    @Test
    void doesNotReadEurekaContextWhileConstructingTheBean() {
        AtomicInteger calls = new AtomicInteger();
        EurekaDiscoveryBackend lazy = new EurekaDiscoveryBackend(
            properties,
            () -> {
                calls.incrementAndGet();
                return context;
            },
            () -> statusInfo
        );
        assertThat(calls).hasValue(0);
        when(registry.getSortedApplications()).thenReturn(List.of());
        assertThat(lazy.getApplications()).isEmpty();
        assertThat(calls).hasValue(1);
    }

    @Test
    void reportsAnUnavailableEurekaContextClearly() {
        EurekaDiscoveryBackend unavailable = new EurekaDiscoveryBackend(properties, () -> null, () -> statusInfo);
        assertThatThrownBy(unavailable::getApplications).isInstanceOf(IllegalStateException.class).hasMessage("Eureka server is not ready");
    }

    @Test
    void preservesStatusAndSafeObjectsWhenEurekaStatusDetailsAreUnavailable() {
        properties.getEureka().setEnvironment("test");
        properties.getEureka().setDatacenter("local");
        when(registry.isBelowRenewThresold()).thenReturn(1);
        Map<String, Object> status = backend.getStatus();
        assertThat(status)
            .containsEntry("backend", "eureka")
            .containsEntry("environment", "test")
            .containsEntry("datacenter", "local")
            .containsEntry("isBelowRenewThreshold", true);
        assertThat(status.get("generalStats")).isEqualTo(Map.of());
        assertThat(((Map<?, ?>) status.get("instanceInfo")).get("status")).isEqualTo("UNKNOWN");
    }

    @Test
    void stripsCredentialsFromReplicasAndKeepsRegistrationTimestamps() {
        PeerEurekaNodes nodes = mock(PeerEurekaNodes.class);
        PeerEurekaNode peer = mock(PeerEurekaNode.class);
        when(context.getPeerEurekaNodes()).thenReturn(nodes);
        when(nodes.getPeerNodesView()).thenReturn(List.of(peer));
        when(peer.getServiceUrl()).thenReturn("https://user:password@peer.example:8761/eureka/");
        when(registry.getLastNRegisteredInstances()).thenReturn(List.of(new Pair<>(100L, "orders:one")));
        when(registry.getLastNCanceledInstances()).thenReturn(List.of(new Pair<>(200L, "orders:two")));
        assertThat(backend.getReplicas()).containsExactly("peer.example:8761");
        assertThat(backend.getLastN())
            .containsEntry("registered", Map.of(100L, "orders:one"))
            .containsEntry("canceled", Map.of(200L, "orders:two"));
    }
}
