package tech.jhipster.registry.discovery;

import java.util.ArrayList;
import java.util.List;

/**
 * An application registered in the discovery backend used by the Registry, with its instances.
 */
public class RegistryApplication {

    private String name;

    private List<RegistryInstance> instances = new ArrayList<>();

    public RegistryApplication() {}

    public RegistryApplication(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<RegistryInstance> getInstances() {
        return instances;
    }

    public void setInstances(List<RegistryInstance> instances) {
        this.instances = instances != null ? instances : new ArrayList<>();
    }
}
