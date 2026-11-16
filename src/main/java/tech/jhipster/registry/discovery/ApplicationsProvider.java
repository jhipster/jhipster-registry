package tech.jhipster.registry.discovery;

import java.util.List;

/**
 * Provides the applications displayed by the Registry UI, whatever the discovery backend in use.
 */
public interface ApplicationsProvider {
    /**
     * @return the applications registered in the discovery backend, sorted by name.
     */
    List<RegistryApplication> getApplications();
}
