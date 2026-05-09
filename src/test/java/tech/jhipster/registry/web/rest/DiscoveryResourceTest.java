package tech.jhipster.registry.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import tech.jhipster.registry.config.ApplicationProperties;
import tech.jhipster.registry.service.discovery.DiscoveryBackend;
import tech.jhipster.registry.service.discovery.DiscoveryBackendSelector;

/**
 * Unit tests for {@link DiscoveryResource}.
 */
@ExtendWith(MockitoExtension.class)
class DiscoveryResourceTest {

    @Mock
    private DiscoveryBackendSelector selector;

    @Mock
    private DiscoveryBackend backend;

    @Mock
    private ApplicationProperties applicationProperties;

    @Mock
    private ApplicationProperties.Discovery discoveryConfig;

    private DiscoveryResource resource;

    @BeforeEach
    void setUp() {
        when(applicationProperties.getDiscovery()).thenReturn(discoveryConfig);
        when(backend.getName()).thenReturn("eureka");
        when(backend.getApplications()).thenReturn(List.of());
        when(backend.getStatus()).thenReturn(Map.of("time", System.currentTimeMillis()));
        when(backend.getReplicas()).thenReturn(List.of());

        resource = new DiscoveryResource(selector, applicationProperties);
    }

    @Test
    void shouldReturnBackendInfo() {
        when(selector.selectBackend(any())).thenReturn(Optional.of(backend));

        var response = resource.getBackend();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("name")).isEqualTo("eureka");
        assertThat(response.getBody().get("active")).isEqualTo(true);
    }

    @Test
    void shouldReturnNoneWhenNoBackend() {
        when(selector.selectBackend(any())).thenReturn(Optional.empty());

        var response = resource.getBackend();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("name")).isEqualTo("none");
        assertThat(response.getBody().get("active")).isEqualTo(false);
    }

    @Test
    void shouldReturnApplications() {
        when(selector.selectBackend(any())).thenReturn(Optional.of(backend));

        var response = resource.getApplications();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("backend")).isEqualTo("eureka");
        assertThat(response.getBody().get("applications")).isInstanceOf(List.class);
    }

    @Test
    void shouldReturnServiceUnavailableWhenNoBackendForApplications() {
        when(selector.selectBackend(any())).thenReturn(Optional.empty());

        var response = resource.getApplications();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
    }

    @Test
    void shouldReturnStatus() {
        when(selector.selectBackend(any())).thenReturn(Optional.of(backend));

        var response = resource.getStatus();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("backend")).isEqualTo("eureka");
        assertThat(response.getBody().get("status")).isInstanceOf(Map.class);
    }

    @Test
    void shouldReturnReplicas() {
        when(selector.selectBackend(any())).thenReturn(Optional.of(backend));

        var response = resource.getReplicas();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("backend")).isEqualTo("eureka");
        assertThat(response.getBody().get("replicas")).isInstanceOf(List.class);
    }

    @Test
    void shouldListBackends() {
        when(selector.getBackends()).thenReturn(List.of(backend));
        when(backend.isActive()).thenReturn(true);

        var response = resource.listBackends();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).get("name")).isEqualTo("eureka");
        assertThat(response.getBody().get(0).get("active")).isEqualTo(true);
    }

    @Test
    void shouldReturnHistory() {
        when(selector.selectBackend(any())).thenReturn(Optional.of(backend));
        when(backend.getHistory()).thenReturn(Optional.of(Map.of(
            "registered", Map.of(1L, "test-app"),
            "canceled", Map.of()
        )));

        var response = resource.getHistory();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("backend")).isEqualTo("eureka");
    }
}
