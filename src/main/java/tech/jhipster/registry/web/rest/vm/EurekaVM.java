package tech.jhipster.registry.web.rest.vm;

import java.util.List;
import java.util.Map;
import tech.jhipster.registry.discovery.RegistryApplication;

/**
 * View Model object for representing Eureka applications list.
 */
public class EurekaVM {

    private List<RegistryApplication> applications;

    private Map<String, Object> status;

    public List<RegistryApplication> getApplications() {
        return applications;
    }

    public void setApplications(List<RegistryApplication> applications) {
        this.applications = applications;
    }

    public Map<String, Object> getStatus() {
        return status;
    }

    public void setStatus(Map<String, Object> status) {
        this.status = status;
    }
}
