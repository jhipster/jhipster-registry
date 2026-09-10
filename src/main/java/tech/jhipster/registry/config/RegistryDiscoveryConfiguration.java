package tech.jhipster.registry.config;

import com.netflix.eureka.EurekaServerContextHolder;
import com.netflix.eureka.resources.StatusResource;
import java.util.Locale;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tech.jhipster.registry.service.discovery.EurekaDiscoveryBackend;
import tech.jhipster.registry.service.discovery.RegistryDiscoveryBackend;
import tech.jhipster.registry.service.discovery.SpringCloudDiscoveryBackend;

/** Selects one discovery provider without requiring a running Eureka server. */
@Configuration
public class RegistryDiscoveryConfiguration {

    @Bean
    public RegistryDiscoveryBackend registryDiscoveryBackend(ApplicationProperties properties, BeanFactory beanFactory) {
        ApplicationProperties.Discovery.Backend backend = properties.getDiscovery().getBackend();
        if (backend == ApplicationProperties.Discovery.Backend.EUREKA) {
            return new EurekaDiscoveryBackend(
                properties,
                () -> EurekaServerContextHolder.getInstance().getServerContext(),
                () -> new StatusResource().getStatusInfo()
            );
        }

        String provider = backend.name().toLowerCase(Locale.ROOT);
        String beanName = provider + "DiscoveryClient";
        if (!beanFactory.containsBean(beanName)) {
            throw new IllegalStateException(
                "The " +
                provider +
                " discovery client is unavailable. Build with the Maven " +
                provider +
                " profile and activate the corresponding Spring profile."
            );
        }
        return new SpringCloudDiscoveryBackend(
            provider,
            beanFactory.getBean(beanName, DiscoveryClient.class),
            properties.getDiscovery().getManagementPath()
        );
    }
}
