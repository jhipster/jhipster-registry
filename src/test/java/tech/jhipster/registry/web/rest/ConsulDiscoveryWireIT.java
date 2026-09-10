package tech.jhipster.registry.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.netflix.eureka.EurekaServerContext;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.ApplicationContext;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import tech.jhipster.registry.IntegrationTest;

/** Opt in with -Pconsul -Ddiscovery.provider=consul; uses real HTTP client, no mocks. */
@IntegrationTest
@AutoConfigureMockMvc
@ActiveProfiles({ "native", "consul" })
@EnabledIfSystemProperty(named = "discovery.provider", matches = "consul")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class ConsulDiscoveryWireIT {

    private static DiscoveryProviderFixture fixture;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ApplicationContext context;

    @BeforeAll
    static void startFixture() throws Exception {
        fixture = new DiscoveryProviderFixture("consul");
    }

    @AfterAll
    static void stopFixture() {
        if (fixture != null) {
            fixture.close();
        }
    }

    @DynamicPropertySource
    static void providerProperties(DynamicPropertyRegistry properties) {
        properties.add("spring.cloud.consul.host", () -> "127.0.0.1");
        properties.add("spring.cloud.consul.port", () -> fixture.port());
        properties.add("spring.cloud.consul.discovery.acl-token", () -> "fixture-token");
        properties.add("spring.cloud.consul.discovery.register", () -> false);
        properties.add("spring.cloud.consul.discovery.catalog-services-watch.enabled", () -> false);
        properties.add("spring.cloud.consul.discovery.query-passing", () -> true);
    }

    @BeforeEach
    void resetFixture() {
        fixture.reset();
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void mapsActualConsulHttpResponsesWithoutEurekaOrRegistration() throws Exception {
        assertThat(context.getBean("consulDiscoveryClient").getClass().getName()).contains("ConsulDiscoveryClient");
        assertThat(context.getBeansOfType(EurekaServerContext.class)).isEmpty();
        mvc
            .perform(get("/api/eureka/applications"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.applications[0].name").value("orders"))
            .andExpect(jsonPath("$.applications[0].configName").value("OrderService"))
            .andExpect(jsonPath("$.applications[0].instances[0].instanceId").value("consul-wire-id"))
            .andExpect(jsonPath("$.applications[0].instances[0].homePageUrl").value("https://service.example:8443/shop"))
            .andExpect(jsonPath("$.applications[0].instances[0].healthCheckUrl").value("https://service.example:9443/management/health"))
            .andExpect(jsonPath("$.applications[0].instances[0].status").value("UNKNOWN"));
        assertThat(fixture.requests()).anyMatch(request -> request.startsWith("GET /v1/catalog/services"));
        assertThat(fixture.requests())
            .anyMatch(request -> request.startsWith("GET /v1/health/service/orders") && request.contains("passing"));
        assertThat(fixture.requests()).allMatch(request -> request.startsWith("GET "));
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void distinguishesActualEmptyCatalogFromDeniedProvider() throws Exception {
        fixture.empty();
        mvc.perform(get("/api/eureka/applications")).andExpect(status().isOk()).andExpect(jsonPath("$.applications").isEmpty());
        fixture.deny();
        mvc
            .perform(get("/api/eureka/status"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status.instanceInfo.status").value("DOWN"))
            .andExpect(jsonPath("$.status.error").value("Discovery backend is unavailable"));
    }
}
