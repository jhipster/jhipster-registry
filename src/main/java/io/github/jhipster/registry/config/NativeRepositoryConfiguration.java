package io.github.jhipster.registry.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.cloud.config.server.environment.EnvironmentRepository;
import org.springframework.cloud.config.server.environment.NativeEnvironmentProperties;
import org.springframework.cloud.config.server.environment.NativeEnvironmentRepository;
import org.springframework.cloud.config.server.environment.NativeEnvironmentRepositoryFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@ConditionalOnMissingBean(EnvironmentRepository.class)
@Profile("native")
class NativeRepositoryConfiguration {

    @Autowired
    private NativeEnvironmentRepositoryFactory nativeEnvironmentRepositoryFactory;

    @Bean
    public NativeEnvironmentRepository nativeEnvironmentRepository(NativeEnvironmentRepositoryFactory factory,
                                                                   NativeEnvironmentProperties environmentProperties) {
        return factory.build(environmentProperties);
    }
}
