package io.github.jhipster.registry.config.registry;

import io.github.jhipster.registry.config.Constants;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.cloud.consul.serviceregistry.ConsulAutoServiceRegistrationAutoConfiguration;
import org.springframework.cloud.consul.serviceregistry.ConsulServiceRegistryAutoConfiguration;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile(Constants.PROFILE_EUREKA)
@Configuration
@EnableEurekaServer
public class EurekaServerConfiguration {
}
