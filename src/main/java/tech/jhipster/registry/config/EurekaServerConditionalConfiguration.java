package tech.jhipster.registry.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableEurekaServer
@ConditionalOnProperty(name = "application.discovery.backend", havingValue = "eureka", matchIfMissing = true)
public class EurekaServerConditionalConfiguration {
}
