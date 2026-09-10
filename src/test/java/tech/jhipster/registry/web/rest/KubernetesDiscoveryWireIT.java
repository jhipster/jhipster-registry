package tech.jhipster.registry.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.netflix.eureka.EurekaServerContext;
import java.util.LinkedHashMap;
import java.util.Map;
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

/** Opt in with -Pkubernetes -Ddiscovery.provider=kubernetes; no real cluster/account. */
@IntegrationTest
@AutoConfigureMockMvc
@ActiveProfiles({ "native", "kubernetes" })
@EnabledIfSystemProperty(named = "discovery.provider", matches = "kubernetes")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class KubernetesDiscoveryWireIT {

    private static DiscoveryProviderFixture fixture;

    private static final Map<String, String> previousSystemProperties = new LinkedHashMap<>();

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ApplicationContext context;

    @BeforeAll
    static void startFixture() throws Exception {
        fixture = new DiscoveryProviderFixture("kubernetes");
        // The provider's early environment processor runs before application YAML.
        // Direct even that phase to the fixture and prevent reading owner credentials.
        overrideProperty("kubernetes.master", fixture.url());
        overrideProperty("kubernetes.auth.tryKubeConfig", "false");
        overrideProperty("kubernetes.auth.tryServiceAccount", "false");
        overrideProperty("kubernetes.auth.token", "fixture-token");
        overrideProperty("kubernetes.namespace", "default");
    }

    @AfterAll
    static void stopFixture() {
        if (fixture != null) {
            fixture.close();
        }
        previousSystemProperties.forEach((name, value) -> {
            if (value == null) {
                System.clearProperty(name);
            } else {
                System.setProperty(name, value);
            }
        });
    }

    @DynamicPropertySource
    static void providerProperties(DynamicPropertyRegistry properties) {
        properties.add("spring.cloud.kubernetes.client.master-url", () -> fixture.url());
        properties.add("spring.cloud.kubernetes.client.namespace", () -> "default");
        properties.add("spring.cloud.kubernetes.client.oauth-token", () -> "fixture-token");
        properties.add("spring.cloud.kubernetes.client.connection-timeout", () -> "1s");
        properties.add("spring.cloud.kubernetes.client.request-timeout", () -> "1s");
        properties.add("spring.cloud.kubernetes.discovery.primary-port-name", () -> "https");
        properties.add("spring.cloud.kubernetes.discovery.include-not-ready-addresses", () -> false);
        properties.add("spring.cloud.kubernetes.discovery.catalog-services-watch.enabled", () -> false);
        properties.add("management.health.kubernetes.enabled", () -> false);
        properties.add("management.info.kubernetes.enabled", () -> false);
    }

    @BeforeEach
    void resetFixture() {
        fixture.reset();
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void usesActualKubernetesHttpClientAndExcludesUnreadyEndpoints() throws Exception {
        assertThat(context.getBean("kubernetesDiscoveryClient").getClass().getName()).contains("KubernetesDiscoveryClient");
        assertThat(context.getBeansOfType(EurekaServerContext.class)).isEmpty();
        mvc
            .perform(get("/api/eureka/applications"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.applications[0].name").value("orders"))
            .andExpect(jsonPath("$.applications[0].configName").value("OrderService"))
            .andExpect(jsonPath("$.applications[0].instances.length()").value(1))
            .andExpect(jsonPath("$.applications[0].instances[0].instanceId").value("ready-pod-id"))
            .andExpect(jsonPath("$.applications[0].instances[0].homePageUrl").value("https://10.0.0.4:8443/shop"))
            .andExpect(jsonPath("$.applications[0].instances[0].healthCheckUrl").value("https://10.0.0.4:9443/management/health"))
            .andExpect(jsonPath("$.applications[0].instances[0].metadata").isMap())
            .andExpect(jsonPath("$.applications[0].instances[0].status").value("UNKNOWN"));
        assertThat(fixture.requests()).anyMatch(request -> request.startsWith("GET /api/v1/namespaces/default/services"));
        assertThat(fixture.requests()).anyMatch(request -> request.contains("/endpoints?") && request.contains("fieldSelector"));
        assertThat(fixture.requests()).allMatch(request -> request.startsWith("GET "));
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void distinguishesActualEmptyServicesFromDeniedProvider() throws Exception {
        fixture.empty();
        mvc.perform(get("/api/eureka/applications")).andExpect(status().isOk()).andExpect(jsonPath("$.applications").isEmpty());
        fixture.deny();
        mvc.perform(get("/api/eureka/status")).andExpect(status().isOk()).andExpect(jsonPath("$.status.instanceInfo.status").value("DOWN"));
    }

    private static void overrideProperty(String name, String value) {
        previousSystemProperties.put(name, System.getProperty(name));
        System.setProperty(name, value);
    }
}
