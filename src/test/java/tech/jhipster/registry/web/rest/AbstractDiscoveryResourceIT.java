package tech.jhipster.registry.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.netflix.eureka.EurekaServerContext;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.DefaultServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import tech.jhipster.registry.config.ApplicationProperties;

/** Exercises the complete application and security chain with controlled provider data. */
@TestPropertySource(
    properties = {
        "management.endpoints.web.base-path=/management",
        "management.endpoints.web.exposure.include=health,info,jhimetrics,threaddump,jhiopenapigroups",
        "management.endpoint.jhimetrics.enabled=true",
    }
)
abstract class AbstractDiscoveryResourceIT {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ApplicationContext context;

    @Autowired
    private ApplicationProperties properties;

    private DiscoveryClient discoveryClient;

    protected abstract String provider();

    @BeforeEach
    void configureProvider() {
        discoveryClient = context.getBean(provider() + "DiscoveryClient", DiscoveryClient.class);
        when(discoveryClient.getServices()).thenReturn(List.of("orders"));
        when(discoveryClient.getInstances("orders"))
            .thenReturn(List.of(new DefaultServiceInstance("opaque-provider-id", "orders", "localhost", 8080, false)));
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void servesInstancesAndLocalManagementWithoutEureka() throws Exception {
        assertThat(properties.getDiscovery().getBackend().name()).isEqualToIgnoringCase(provider());
        assertThat(context.getBeansOfType(EurekaServerContext.class)).isEmpty();
        mvc
            .perform(get("/api/eureka/applications"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.applications[0].name").value("orders"))
            .andExpect(jsonPath("$.applications[0].configName").value("orders"))
            .andExpect(jsonPath("$.applications[0].instances[0].instanceId").value("opaque-provider-id"))
            .andExpect(jsonPath("$.applications[0].instances[0].metadata").isMap())
            .andExpect(jsonPath("$.applications[0].instances[0].status").value("UNKNOWN"));
        mvc
            .perform(get("/api/eureka/status"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status.backend").value(provider()))
            .andExpect(jsonPath("$.status.generalStats").isMap())
            .andExpect(jsonPath("$.status.instanceInfo").isMap());
        mvc.perform(get("/api/eureka/lastn")).andExpect(status().isOk()).andExpect(jsonPath("$.registered").isEmpty());
        mvc.perform(get("/api/eureka/replicas")).andExpect(status().isOk()).andExpect(jsonPath("$").isEmpty());
        mvc
            .perform(get("/management/info").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
        mvc
            .perform(get("/management/jhimetrics").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.jvm").isMap());
        mvc
            .perform(get("/management/threaddump").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.threads").isArray());
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void returnsAnEmptyRegistryOnlyWhenProviderReturnsNoServices() throws Exception {
        when(discoveryClient.getServices()).thenReturn(List.of());
        mvc.perform(get("/api/eureka/applications")).andExpect(status().isOk()).andExpect(jsonPath("$.applications").isEmpty());
    }

    @Test
    @WithMockUser(authorities = "ROLE_USER")
    void forbidsNonAdministrators() throws Exception {
        for (String endpoint : List.of("applications", "status", "lastn", "replicas")) {
            mvc.perform(get("/api/eureka/" + endpoint)).andExpect(status().isForbidden());
        }
    }

    @Test
    void requiresAuthentication() throws Exception {
        mvc.perform(get("/api/eureka/applications")).andExpect(status().isUnauthorized());
    }
}
