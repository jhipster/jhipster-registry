package tech.jhipster.registry.config;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.boot.DefaultPropertiesPropertySource;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;

/** Keeps optional clients off before their early environment processors can run. */
public class OptionalDiscoveryEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> defaults = new LinkedHashMap<>();
        for (String provider : new String[] { "consul", "kubernetes" }) {
            String property = "spring.cloud." + provider + ".enabled";
            if (!environment.containsProperty(property)) {
                defaults.put(property, false);
            }
        }
        // Boot keeps this named source last after loading config data. Explicit provider
        // profile YAML can therefore enable its client after early processing is over.
        DefaultPropertiesPropertySource.addOrMerge(defaults, environment.getPropertySources());
    }

    @Override
    public int getOrder() {
        // Spring Cloud Kubernetes 2.1.x's processor runs at ConfigData ORDER - 1.
        return ConfigDataEnvironmentPostProcessor.ORDER - 2;
    }
}
