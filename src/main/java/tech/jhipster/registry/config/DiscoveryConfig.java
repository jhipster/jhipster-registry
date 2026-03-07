package tech.jhipster.registry.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Configuration class for abstracting service discovery mechanisms.
 * Supports Eureka, Consul, and Kubernetes discovery systems.
 */
@Configuration
public class DiscoveryConfig {

    @Value("${jhipster.registry.discovery-type:eureka}")
    private String discoveryType;

    /**
     * Get the current discovery type being used.
     * @return discovery type (eureka, consul, or kubernetes)
     */
    @Bean
    public DiscoveryType discoveryType() {
        return DiscoveryType.fromString(discoveryType);
    }

    /**
     * Enumeration of supported discovery types.
     */
    public enum DiscoveryType {
        EUREKA("eureka"),
        CONSUL("consul"),
        KUBERNETES("kubernetes");

        private final String value;

        DiscoveryType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static DiscoveryType fromString(String text) {
            for (DiscoveryType type : DiscoveryType.values()) {
                if (type.value.equalsIgnoreCase(text)) {
                    return type;
                }
            }
            return EUREKA; // default
        }
    }

    /**
     * Eureka-specific configuration.
     */
    @Configuration
    @Profile("!consul & !kubernetes")
    @ConditionalOnProperty(name = "eureka.client.enabled", havingValue = "true", matchIfMissing = true)
    static class EurekaDiscoveryConfig {
        // Eureka is enabled by default through Spring Cloud Netflix
    }

    /**
     * Consul-specific configuration.
     */
    @Configuration
    @Profile("consul")
    @ConditionalOnProperty(name = "spring.cloud.consul.enabled", havingValue = "true")
    static class ConsulDiscoveryConfig {
        // Consul discovery enabled through Spring Cloud Consul
    }

    /**
     * Kubernetes-specific configuration.
     */
    @Configuration
    @Profile("kubernetes")
    @ConditionalOnProperty(name = "spring.cloud.kubernetes.enabled", havingValue = "true")
    static class KubernetesDiscoveryConfig {
        // Kubernetes discovery enabled through Spring Cloud Kubernetes
    }
}
