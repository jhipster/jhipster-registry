package io.github.jhipster.registry.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

@ConfigurationProperties(prefix = "spring.cloud.config")
public class ConfigServerConfig {

    @NestedConfigurationProperty
    private Server server;

    private String label;

    public Server getServer() {
        return server;
    }

    public void setServer(Server server) {
        this.server = server;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static class Server {
        private List<Map<String, Object>> composite = new ArrayList<>();

        public List<Map<String, Object>> getComposite() {
            return composite;
        }
    }
}
