package tech.jhipster.registry.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.annotation.Configuration;

/** Activates the Eureka server only when it is the selected discovery backend. */
@Configuration
@EnableEurekaServer
@ConditionalOnProperty(prefix = "application.discovery", name = "backend", havingValue = "eureka", matchIfMissing = true)
public class EurekaServerConfiguration {}
