package tech.jhipster.registry.config;

import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/** Preserve the embedded server unless an external discovery profile is selected. */
@Configuration(proxyBeanMethods = false)
@Profile("!consul & !kubernetes")
@EnableEurekaServer
public class EurekaServerConfiguration {}
