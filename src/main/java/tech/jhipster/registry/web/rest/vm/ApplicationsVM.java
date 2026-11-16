package tech.jhipster.registry.web.rest.vm;

import java.util.List;
import tech.jhipster.registry.discovery.RegistryApplication;

/**
 * View Model object for representing the applications registered in the discovery backend in use.
 */
public class ApplicationsVM {

    private String backend;

    private List<RegistryApplication> applications;

    public String getBackend() {
        return backend;
    }

    public void setBackend(String backend) {
        this.backend = backend;
    }

    public List<RegistryApplication> getApplications() {
        return applications;
    }

    public void setApplications(List<RegistryApplication> applications) {
        this.applications = applications;
    }
}
