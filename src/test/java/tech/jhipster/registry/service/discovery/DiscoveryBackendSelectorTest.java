package tech.jhipster.registry.service.discovery;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Unit tests for {@link DiscoveryBackendSelector}.
 */
@ExtendWith(MockitoExtension.class)
class DiscoveryBackendSelectorTest {

    @Mock
    private DiscoveryBackend eurekaBackend;

    @Mock
    private DiscoveryBackend consulBackend;

    private DiscoveryBackendSelector selector;

    @BeforeEach
    void setUp() {
        when(eurekaBackend.getName()).thenReturn("eureka");
        when(consulBackend.getName()).thenReturn("consul");

        selector = new DiscoveryBackendSelector(List.of(eurekaBackend, consulBackend));
    }

    @Test
    void shouldSelectPreferredBackend() {
        when(eurekaBackend.isActive()).thenReturn(true);

        var result = selector.selectBackend("eureka");

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("eureka");
    }

    @Test
    void shouldSelectFirstActiveBackendWhenNoPreference() {
        when(eurekaBackend.isActive()).thenReturn(false);
        when(consulBackend.isActive()).thenReturn(true);

        var result = selector.selectBackend(null);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("consul");
    }

    @Test
    void shouldFallbackFromInactivePreferredToFirstActive() {
        when(eurekaBackend.isActive()).thenReturn(false);
        when(consulBackend.isActive()).thenReturn(true);

        var result = selector.selectBackend("eureka");

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("consul");
    }

    @Test
    void shouldReturnEmptyWhenNoBackendActive() {
        when(eurekaBackend.isActive()).thenReturn(false);
        when(consulBackend.isActive()).thenReturn(false);

        var result = selector.selectBackend(null);

        assertThat(result).isEmpty();
    }

    @Test
    void shouldReturnEmptyForUnknownPreferredName() {
        var result = selector.selectBackend("unknown");

        assertThat(result).isEmpty();
    }

    @Test
    void shouldReturnAllBackends() {
        var backends = selector.getBackends();

        assertThat(backends).hasSize(2);
        assertThat(backends).extracting(DiscoveryBackend::getName)
            .containsExactly("eureka", "consul");
    }
}
