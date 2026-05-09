package tech.jhipster.registry.service.discovery;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tech.jhipster.registry.config.ApplicationProperties;

/**
 * Unit tests for {@link EurekaDiscoveryBackend}.
 *
 * Tests cover the backend identity, error handling, and
 * graceful fallback when Eureka is not available.
 */
@ExtendWith(MockitoExtension.class)
class EurekaDiscoveryBackendTest {

    @Mock
    private ApplicationProperties applicationProperties;

    @Mock
    private ApplicationProperties.Eureka eureka;

    private EurekaDiscoveryBackend backend;

    @BeforeEach
    void setUp() {
        when(applicationProperties.getEureka()).thenReturn(eureka);
        backend = new EurekaDiscoveryBackend(applicationProperties);
    }

    @Test
    void shouldReturnName() {
        assertThat(backend.getName()).isEqualTo("eureka");
    }

    @Test
    void shouldReturnEmptyApplicationsWhenRegistryNotAvailable() {
        List<Map<String, Object>> apps = backend.getApplications();
        assertThat(apps).isEmpty();
    }

    @Test
    void shouldReturnStatusWithErrorWhenRegistryNotAvailable() {
        Map<String, Object> status = backend.getStatus();
        // Should still return basic status fields even if registry unavailable
        assertThat(status).isNotEmpty();
        assertThat(status).containsKey("time");
    }

    @Test
    void shouldReturnEmptyReplicasWhenNotAvailable() {
        List<String> replicas = backend.getReplicas();
        assertThat(replicas).isEmpty();
    }

    @Test
    void shouldNotBeActiveWhenEurekaContextNotAvailable() {
        assertThat(backend.isActive()).isFalse();
    }

    @Test
    void shouldReturnEmptyHistoryWhenRegistryNotAvailable() {
        var history = backend.getHistory();
        assertThat(history).isPresent();
        assertThat(history.get()).containsOnlyKeys("canceled", "registered");
        assertThat(history.get().get("canceled")).isEmpty();
        assertThat(history.get().get("registered")).isEmpty();
    }
}
