package tech.jhipster.registry.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.DefaultPropertiesPropertySource;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.io.support.SpringFactoriesLoader;
import org.springframework.mock.env.MockEnvironment;

class OptionalDiscoveryEnvironmentPostProcessorTest {

    private final OptionalDiscoveryEnvironmentPostProcessor processor = new OptionalDiscoveryEnvironmentPostProcessor();

    @Test
    void disablesOptionalClientsBeforeKubernetesAndPreservesExistingDefaults() {
        MockEnvironment environment = new MockEnvironment();
        DefaultPropertiesPropertySource.addOrMerge(Map.of("spring.profiles.default", "dev"), environment.getPropertySources());

        processor.postProcessEnvironment(environment, new SpringApplication());

        assertThat(environment.getProperty("spring.cloud.consul.enabled", Boolean.class)).isFalse();
        assertThat(environment.getProperty("spring.cloud.kubernetes.enabled", Boolean.class)).isFalse();
        assertThat(environment.getProperty("spring.profiles.default")).isEqualTo("dev");
        assertThat(processor.getOrder()).isLessThan(ConfigDataEnvironmentPostProcessor.ORDER - 1);
    }

    @Test
    void preservesAnExplicitEarlyProviderOptIn() {
        MockEnvironment environment = new MockEnvironment();
        environment
            .getPropertySources()
            .addFirst(new MapPropertySource("commandLineArgs", Map.of("spring.cloud.kubernetes.enabled", true)));

        processor.postProcessEnvironment(environment, new SpringApplication());

        assertThat(environment.getProperty("spring.cloud.kubernetes.enabled", Boolean.class)).isTrue();
        assertThat(environment.getProperty("spring.cloud.consul.enabled", Boolean.class)).isFalse();
    }

    @Test
    void allowsLaterSelectedProfileConfigToOverrideEarlyDefaults() {
        MockEnvironment environment = new MockEnvironment();
        processor.postProcessEnvironment(environment, new SpringApplication());

        environment
            .getPropertySources()
            .addLast(new MapPropertySource("application-kubernetes.yml", Map.of("spring.cloud.kubernetes.enabled", true)));
        DefaultPropertiesPropertySource.moveToEnd(environment);

        assertThat(environment.getProperty("spring.cloud.kubernetes.enabled", Boolean.class)).isTrue();
        assertThat(environment.getProperty("spring.cloud.consul.enabled", Boolean.class)).isFalse();
    }

    @Test
    void isRegisteredForRealSpringApplicationStartup() {
        assertThat(SpringFactoriesLoader.loadFactoryNames(EnvironmentPostProcessor.class, getClass().getClassLoader()))
            .contains(OptionalDiscoveryEnvironmentPostProcessor.class.getName());
    }
}
