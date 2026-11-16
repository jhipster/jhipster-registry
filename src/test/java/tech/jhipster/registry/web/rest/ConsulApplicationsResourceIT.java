package tech.jhipster.registry.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import tech.jhipster.registry.IntegrationTest;
import tech.jhipster.registry.discovery.ApplicationsProvider;
import tech.jhipster.registry.discovery.DiscoveryClientApplicationsProvider;
import tech.jhipster.registry.discovery.EurekaApplicationsProvider;
import tech.jhipster.registry.security.AuthoritiesConstants;

/**
 * Integration tests for the {@link ApplicationsResource} REST controller with the Consul backend.
 * <p>
 * The applications are provided by the discovery client of Spring Cloud, which is the Consul client when the
 * {@code consul} profile is active. Its own client is replaced here by the simple discovery client of Spring Cloud.
 */
@AutoConfigureMockMvc
@IntegrationTest
@TestPropertySource(
    properties = {
        "application.discovery.backend=consul",
        "eureka.client.enabled=false",
        "spring.cloud.discovery.client.simple.instances.jhipsterSampleMicroservice[0].instance-id=jhipsterSampleMicroservice:1",
        "spring.cloud.discovery.client.simple.instances.jhipsterSampleMicroservice[0].host=localhost",
        "spring.cloud.discovery.client.simple.instances.jhipsterSampleMicroservice[0].port=8081",
        "spring.cloud.discovery.client.simple.instances.jhipsterSampleMicroservice[0].metadata.version=1.0.0",
    }
)
class ConsulApplicationsResourceIT {

    static final String TEST_USER_LOGIN = "test";

    @Autowired
    private MockMvc restApplicationsMockMvc;

    @Autowired
    private ApplicationsProvider applicationsProvider;

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    @WithMockUser(username = TEST_USER_LOGIN, authorities = AuthoritiesConstants.ADMIN)
    void shouldGetApplicationsFromConsul() throws Exception {
        restApplicationsMockMvc
            .perform(get("/api/applications").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.backend").value("consul"))
            .andExpect(jsonPath("$.applications[0].name").value("jhipsterSampleMicroservice"))
            .andExpect(jsonPath("$.applications[0].instances[0].instanceId").value("jhipsterSampleMicroservice:1"))
            .andExpect(jsonPath("$.applications[0].instances[0].homePageUrl").value("http://localhost:8081"))
            .andExpect(jsonPath("$.applications[0].instances[0].healthCheckUrl").value("http://localhost:8081/management/health"))
            .andExpect(jsonPath("$.applications[0].instances[0].statusPageUrl").value("http://localhost:8081/management/info"))
            .andExpect(jsonPath("$.applications[0].instances[0].status").value("UP"))
            .andExpect(jsonPath("$.applications[0].instances[0].metadata.version").value("1.0.0"));
    }

    @Test
    @WithMockUser(username = TEST_USER_LOGIN)
    void shouldNotGetApplicationsWithoutAdminAuthority() throws Exception {
        restApplicationsMockMvc.perform(get("/api/applications").accept(MediaType.APPLICATION_JSON)).andExpect(status().isForbidden());
    }

    @Test
    void shouldUseTheDiscoveryClientAsApplicationsProvider() {
        assertThat(applicationsProvider).isInstanceOf(DiscoveryClientApplicationsProvider.class);
    }

    @Test
    void shouldNotUseEureka() {
        assertThat(applicationContext.getBeansOfType(EurekaApplicationsProvider.class)).isEmpty();
        assertThat(applicationContext.getBeansOfType(EurekaResource.class)).isEmpty();
    }
}
