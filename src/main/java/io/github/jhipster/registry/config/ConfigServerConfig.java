package io.github.jhipster.registry.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "spring.cloud.config.server")
public class ConfigServerConfig {

    private List<Map<String, Object>> composite = new ArrayList<>();

    public List<Map<String, Object>> getComposite() {
        return composite;
    }
}
