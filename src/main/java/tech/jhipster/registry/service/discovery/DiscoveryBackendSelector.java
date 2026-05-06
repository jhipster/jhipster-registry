package tech.jhipster.registry.service.discovery;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

/**
 * Selects the first active discovery backend.
 * Priority order is:
 * 1) backend with explicit application.discovery.backend property
 * 2) first active backend among those available
 */
@Service
public class DiscoveryBackendSelector {

    private final List<DiscoveryBackend> backends;

    public DiscoveryBackendSelector(List<DiscoveryBackend> backends) {
        this.backends = backends;
    }

    public Optional<DiscoveryBackend> selectBackend(String preferredName) {
        if (preferredName != null && !preferredName.isBlank()) {
            return backends.stream()
                .filter(b -> b.getName().equalsIgnoreCase(preferredName))
                .findFirst();
        }

        return backends.stream().filter(DiscoveryBackend::isActive).findFirst();
    }

    public List<DiscoveryBackend> getBackends() {
        return backends;
    }
}
