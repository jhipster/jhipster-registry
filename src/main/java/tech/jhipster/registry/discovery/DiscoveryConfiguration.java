package tech.jhipster.registry.discovery;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tech.jhipster.registry.config.ApplicationProperties;

/**
 * Configuration of the {@link ApplicationsProvider} matching the discovery backend selected with the
 * {@code application.discovery.backend} property. Eureka is used by default.
 */
@Configuration
public class DiscoveryConfiguration {

    @Bean
    @ConditionalOnProperty(
        prefix = ApplicationProperties.Discovery.PROPERTY_PREFIX,
        name = "backend",
        havingValue = "eureka",
        matchIfMissing = true
    )
    public ApplicationsProvider eurekaApplicationsProvider() {
        return new EurekaApplicationsProvider();
    }

    @Bean
    @ConditionalOnProperty(prefix = ApplicationProperties.Discovery.PROPERTY_PREFIX, name = "backend", havingValue = "consul")
    public ApplicationsProvider consulApplicationsProvider(DiscoveryClient discoveryClient) {
        return new DiscoveryClientApplicationsProvider(discoveryClient);
    }

    @Bean
    @ConditionalOnProperty(prefix = ApplicationProperties.Discovery.PROPERTY_PREFIX, name = "backend", havingValue = "kubernetes")
    public ApplicationsProvider kubernetesApplicationsProvider(DiscoveryClient discoveryClient) {
        return new DiscoveryClientApplicationsProvider(discoveryClient);
    }
}
