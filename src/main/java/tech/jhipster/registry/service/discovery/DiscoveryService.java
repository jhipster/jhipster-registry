package tech.jhipster.registry.service.discovery;

import java.util.List;
import java.util.Map;

public interface DiscoveryService {

    List<Map<String, Object>> getApplications();

    Map<String, Map<Long, String>> getHistory();

    List<String> getReplicas();

    Map<String, Object> getStatus();
}
