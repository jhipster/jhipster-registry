package tech.jhipster.registry.service.discovery;

import java.util.List;
import java.util.Map;

/** Supplies the existing Registry API independently of the discovery provider. */
public interface RegistryDiscoveryBackend {
    List<Map<String, Object>> getApplications();

    Map<String, Object> getStatus();

    List<String> getReplicas();

    Map<String, Map<Long, String>> getLastN();
}
