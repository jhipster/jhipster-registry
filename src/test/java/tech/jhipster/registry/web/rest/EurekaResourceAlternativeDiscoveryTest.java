package tech.jhipster.registry.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.netflix.eureka.EurekaServerContextHolder;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.cloud.client.DefaultServiceInstance;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import tech.jhipster.registry.config.ApplicationProperties;

/** Exercises the actual UI endpoints with a controlled discovery client and no Eureka server. */
class EurekaResourceAlternativeDiscoveryTest {

    @ParameterizedTest
    @ValueSource(strings = { "consul", "kubernetes" })
    void listsInstancesWithoutAnEmbeddedEurekaServer(String provider) throws Exception {
        try (AnnotationConfigApplicationContext context = discoveryContext(provider)) {
            mockMvc(context)
                .perform(get("/api/eureka/applications").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.applications[0].name").value("orders"))
                .andExpect(jsonPath("$.applications[0].instances[0].instanceId").value("orders-1"))
                .andExpect(jsonPath("$.applications[0].instances[0].metadata").isMap());
        }
    }

    @ParameterizedTest
    @ValueSource(strings = { "consul", "kubernetes" })
    void servesDashboardStatusWithoutEureka(String provider) throws Exception {
        try (AnnotationConfigApplicationContext context = discoveryContext(provider)) {
            mockMvc(context)
                .perform(get("/api/eureka/status").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status.generalStats").isMap())
                .andExpect(jsonPath("$.status.instanceInfo").isMap());
        }
    }

    @ParameterizedTest
    @ValueSource(strings = { "consul", "kubernetes" })
    void servesCompatibleHistoryWithoutEurekaLeases(String provider) throws Exception {
        try (AnnotationConfigApplicationContext context = discoveryContext(provider)) {
            mockMvc(context)
                .perform(get("/api/eureka/lastn").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.registered").isMap())
                .andExpect(jsonPath("$.canceled").isMap());
        }
    }

    @ParameterizedTest
    @ValueSource(strings = { "consul", "kubernetes" })
    void servesCompatibleReplicaListWithoutEurekaPeers(String provider) throws Exception {
        try (AnnotationConfigApplicationContext context = discoveryContext(provider)) {
            mockMvc(context)
                .perform(get("/api/eureka/replicas").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
        }
    }

    @Test
    void rejectsConflictingDiscoveryProfilesAtStartup() {
        try (AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext()) {
            context.getEnvironment().setActiveProfiles("consul", "kubernetes");
            context.register(ApplicationProperties.class, EurekaResource.class);
            assertThatThrownBy(context::refresh)
                .hasRootCauseInstanceOf(IllegalArgumentException.class)
                .hasStackTraceContaining("Select only one discovery profile");
        }
    }

    @ParameterizedTest
    @ValueSource(strings = { "consul", "kubernetes" })
    void requiresTheRequestedProviderInsteadOfSilentlyUsingAnotherClient(String provider) {
        try (AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext()) {
            context.getEnvironment().setActiveProfiles(provider);
            context.register(ApplicationProperties.class, EurekaResource.class);
            assertThatThrownBy(context::refresh)
                .hasRootCauseInstanceOf(org.springframework.beans.factory.NoSuchBeanDefinitionException.class)
                .hasStackTraceContaining(provider + "DiscoveryClient");
        }
    }

    private AnnotationConfigApplicationContext discoveryContext(String provider) {
        assertThat(EurekaServerContextHolder.getInstance()).isNull();
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
        context.getEnvironment().setActiveProfiles(provider);
        context.registerBean(
            provider + "DiscoveryClient",
            DiscoveryClient.class,
            () ->
                new DiscoveryClient() {
                    @Override
                    public String description() {
                        return "Controlled " + provider + " discovery fixture";
                    }

                    @Override
                    public List<ServiceInstance> getInstances(String serviceId) {
                        return "orders".equals(serviceId)
                            ? List.of(new DefaultServiceInstance("orders-1", "orders", "127.0.0.1", 8082, false))
                            : List.of();
                    }

                    @Override
                    public List<String> getServices() {
                        return List.of("orders");
                    }
                }
        );
        context.register(ApplicationProperties.class, EurekaResource.class);
        context.refresh();
        return context;
    }

    private MockMvc mockMvc(AnnotationConfigApplicationContext context) {
        return MockMvcBuilders.standaloneSetup(context.getBean(EurekaResource.class)).build();
    }
}
