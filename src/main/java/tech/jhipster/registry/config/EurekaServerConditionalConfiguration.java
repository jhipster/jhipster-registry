package tech.jhipster.registry.config;

import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@EnableEurekaServer
@Profile("!consul & !kubernetes")
public class EurekaServerConditionalConfiguration {
}
