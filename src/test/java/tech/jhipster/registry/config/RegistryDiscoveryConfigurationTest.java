package tech.jhipster.registry.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Configuration;
import tech.jhipster.registry.service.discovery.EurekaDiscoveryBackend;
import tech.jhipster.registry.service.discovery.RegistryDiscoveryBackend;
import tech.jhipster.registry.service.discovery.SpringCloudDiscoveryBackend;

class RegistryDiscoveryConfigurationTest {

    private final ApplicationContextRunner runner = new ApplicationContextRunner()
        .withUserConfiguration(PropertiesConfiguration.class, RegistryDiscoveryConfiguration.class, EurekaServerConfiguration.class);

    @Test
    void defaultsToEurekaWithoutAnyOtherDiscoveryClient() {
        runner.run(context -> {
            assertThat(context).hasNotFailed().hasSingleBean(RegistryDiscoveryBackend.class);
            assertThat(context.getBean(RegistryDiscoveryBackend.class)).isInstanceOf(EurekaDiscoveryBackend.class);
            assertThat(context).hasBean("eurekaServerMarkerBean");
        });
    }

    @ParameterizedTest
    @ValueSource(strings = { "consul", "kubernetes" })
    void selectsTheNamedClientWithoutEnablingEureka(String provider) {
        runner
            .withPropertyValues("application.discovery.backend=" + provider)
            .withBean(provider + "DiscoveryClient", DiscoveryClient.class, () -> mock(DiscoveryClient.class))
            .run(context -> {
                assertThat(context).hasNotFailed().hasSingleBean(RegistryDiscoveryBackend.class);
                assertThat(context.getBean(RegistryDiscoveryBackend.class)).isInstanceOf(SpringCloudDiscoveryBackend.class);
                assertThat(context).doesNotHaveBean("eurekaServerMarkerBean");
            });
    }

    @ParameterizedTest
    @ValueSource(strings = { "consul", "kubernetes" })
    void rejectsASelectedProviderThatIsNotInstalled(String provider) {
        runner
            .withPropertyValues("application.discovery.backend=" + provider)
            .run(context -> {
                assertThat(context).hasFailed();
                assertThat(context.getStartupFailure())
                    .hasRootCauseMessage(
                        "The " +
                        provider +
                        " discovery client is unavailable. Build with the Maven " +
                        provider +
                        " profile and activate the corresponding Spring profile."
                    );
            });
    }

    @Test
    void rejectsUnknownProviderInsteadOfFallingBackToEureka() {
        runner.withPropertyValues("application.discovery.backend=missing-provider").run(context -> assertThat(context).hasFailed());
    }

    @Configuration(proxyBeanMethods = false)
    @EnableConfigurationProperties(ApplicationProperties.class)
    static class PropertiesConfiguration {}
}
