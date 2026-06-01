package tech.jhipster.registry.service.discovery;

import java.util.List;
import java.util.Map;

public interface DiscoveryService {

    String getBackendType();

    List<Map<String, Object>> getApplications();

    Map<String, Object> getStatus();

    List<String> getReplicas();

    Map<String, Map<Long, String>> getLastN();
}
