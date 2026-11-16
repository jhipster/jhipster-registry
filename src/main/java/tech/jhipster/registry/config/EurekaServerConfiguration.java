package tech.jhipster.registry.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.annotation.Configuration;

/**
 * Starts the embedded Eureka server, which is the discovery backend of the Registry by default.
 * <p>
 * When another backend is selected, for example with the {@code consul} or {@code kubernetes} profile, the Registry
 * only uses its discovery client and does not start an Eureka server.
 */
@Configuration
@EnableEurekaServer
@ConditionalOnProperty(
    prefix = ApplicationProperties.Discovery.PROPERTY_PREFIX,
    name = "backend",
    havingValue = "eureka",
    matchIfMissing = true
)
public class EurekaServerConfiguration {}
