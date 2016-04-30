package io.github.jhipster.registry.web.rest.dto;

import java.util.ArrayList;
import java.util.Map;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * A DTO representing a user's credentials
 */
public class EurekaDTO {

    private ArrayList<Map<String, Object>> applications;

    public ArrayList<Map<String, Object>> getApplications() {
        return applications;
    }

    public void setApplications(ArrayList<Map<String, Object>> applications) {
        this.applications = applications;
    }
}
