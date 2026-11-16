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
 * Integration tests for the {@link ApplicationsResource} REST controller with the Kubernetes backend.
 * <p>
 * The applications are provided by the discovery client of Spring Cloud, which is the Kubernetes client when the
 * {@code kubernetes} profile is active. The Kubernetes client itself is replaced here by the simple discovery
 * client of Spring Cloud.
 */
@AutoConfigureMockMvc
@IntegrationTest
@TestPropertySource(
    properties = {
        "application.discovery.backend=kubernetes",
        "eureka.client.enabled=false",
        "spring.cloud.discovery.client.simple.instances.jhipster-sample-microservice[0].instance-id=1e0a1e1e-4ad7-4b31-b7ae-4d5a5dd9cb2c",
        "spring.cloud.discovery.client.simple.instances.jhipster-sample-microservice[0].host=10.1.1.2",
        "spring.cloud.discovery.client.simple.instances.jhipster-sample-microservice[0].port=8081",
    }
)
class KubernetesApplicationsResourceIT {

    static final String TEST_USER_LOGIN = "test";

    @Autowired
    private MockMvc restApplicationsMockMvc;

    @Autowired
    private ApplicationsProvider applicationsProvider;

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    @WithMockUser(username = TEST_USER_LOGIN, authorities = AuthoritiesConstants.ADMIN)
    void shouldGetApplicationsFromKubernetes() throws Exception {
        restApplicationsMockMvc
            .perform(get("/api/applications").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.backend").value("kubernetes"))
            .andExpect(jsonPath("$.applications[0].name").value("jhipster-sample-microservice"))
            .andExpect(jsonPath("$.applications[0].instances[0].instanceId").value("1e0a1e1e-4ad7-4b31-b7ae-4d5a5dd9cb2c"))
            .andExpect(jsonPath("$.applications[0].instances[0].homePageUrl").value("http://10.1.1.2:8081"))
            .andExpect(jsonPath("$.applications[0].instances[0].status").value("UP"));
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
