package io.github.jhipster.registry.web.rest.dto;

import java.util.List;
import java.util.Map;

/**
 * A DTO representing Eureka applications list.
 */
public class EurekaDTO {

    private List<Map<String, Object>> applications;

    private Map<String, Object> status;

    public List<Map<String, Object>> getApplications() {
        return applications;
    }

    public void setApplications(List<Map<String, Object>> applications) {
        this.applications = applications;
    }

    public Map<String, Object> getStatus() {
        return status;
    }

    public void setStatus(Map<String, Object> status) {
        this.status = status;
    }
}
