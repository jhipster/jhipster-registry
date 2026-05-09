package tech.jhipster.registry.service.discovery;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Selects the active discovery backend based on configuration or availability.
 * <p>
 * The selection order is:
 * <ol>
 *   <li>A backend explicitly specified via the {@code application.discovery.backend} property</li>
 *   <li>The first active backend found among registered implementations</li>
 * </ol>
 */
@Component
public class DiscoveryBackendSelector {

    private final Logger log = LoggerFactory.getLogger(DiscoveryBackendSelector.class);
    private final List<DiscoveryBackend> backends;

    public DiscoveryBackendSelector(List<DiscoveryBackend> backends) {
        this.backends = backends;
        log.info("Registered discovery backends: {}", backends.stream().map(DiscoveryBackend::getName).toList());
    }

    /**
     * Select the best discovery backend based on preferred name or active status.
     *
     * @param preferredName the preferred backend name (may be null)
     * @return an Optional containing the selected backend, or empty if none is available
     */
    public Optional<DiscoveryBackend> selectBackend(String preferredName) {
        if (preferredName != null && !preferredName.isBlank()) {
            Optional<DiscoveryBackend> preferred = backends.stream()
                .filter(b -> b.getName().equalsIgnoreCase(preferredName))
                .findFirst();
            if (preferred.isPresent() && preferred.get().isActive()) {
                log.debug("Selected preferred discovery backend: {}", preferredName);
                return preferred;
            }
            log.warn("Preferred backend '{}' is not active, falling back to first available", preferredName);
        }

        Optional<DiscoveryBackend> active = backends.stream()
            .filter(DiscoveryBackend::isActive)
            .findFirst();
        log.debug("Selected first active discovery backend: {}",
            active.map(DiscoveryBackend::getName).orElse("none"));
        return active;
    }

    /**
     * @return the list of all registered discovery backends
     */
    public List<DiscoveryBackend> getBackends() {
        return backends;
    }
}
