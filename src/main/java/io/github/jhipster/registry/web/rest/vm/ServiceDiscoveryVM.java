package io.github.jhipster.registry.web.rest.vm;

import java.util.List;
import java.util.Map;

/**
 * View Model object for representing Consul instances list.
 */
public class ServiceDiscoveryVM {

    private List<Map<String, Object>> instances;

    public List<Map<String, Object>> getInstances() {
        return instances;
    }

    public void setInstances(List<Map<String, Object>> instances) {
        this.instances = instances;
    }
}
