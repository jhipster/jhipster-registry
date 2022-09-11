package tech.jhipster.registry.web.rest.vm;

import java.util.List;
import java.util.Map;

/**
 * View Model object for representing the Spring Cloud Config bootstrap configuration
 */
public class CloudConfigVM {

    private String label;

    private List<Map<String, Object>> serverConfigurationSources;

    public CloudConfigVM(String label, List<Map<String, Object>> serverConfigurationSources) {
        this.label = label;
        this.serverConfigurationSources = serverConfigurationSources;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public List<Map<String, Object>> getServerConfigurationSources() {
        return serverConfigurationSources;
    }

    public void setServerConfigurationSources(List<Map<String, Object>> serverConfigurationSources) {
        this.serverConfigurationSources = serverConfigurationSources;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CloudConfigVM{" +
            "label='" + label + '\'' +
            ", serverConfigurationSources=" + serverConfigurationSources +
            '}';
    }
}
