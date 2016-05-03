package io.github.jhipster.registry.web.rest.dto;

import java.util.List;
import java.util.Map;

/**
 * A DTO representing Eureka applications list.
 */
public class EurekaDTO {

    private List<Map<String, Object>> applications;

    public List<Map<String, Object>> getApplications() {
        return applications;
    }

    public void setApplications(List<Map<String, Object>> applications) {
        this.applications = applications;
    }
}
