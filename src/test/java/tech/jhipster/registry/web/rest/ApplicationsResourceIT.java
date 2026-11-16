package tech.jhipster.registry.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import tech.jhipster.registry.IntegrationTest;
import tech.jhipster.registry.discovery.ApplicationsProvider;
import tech.jhipster.registry.discovery.EurekaApplicationsProvider;
import tech.jhipster.registry.security.AuthoritiesConstants;

/**
 * Integration tests for the {@link ApplicationsResource} REST controller, with the default Eureka backend.
 */
@AutoConfigureMockMvc
@IntegrationTest
class ApplicationsResourceIT {

    static final String TEST_USER_LOGIN = "test";

    @Autowired
    private MockMvc restApplicationsMockMvc;

    @Autowired
    private ApplicationsProvider applicationsProvider;

    @Test
    @WithMockUser(username = TEST_USER_LOGIN, authorities = AuthoritiesConstants.ADMIN)
    void shouldGetApplicationsFromEureka() throws Exception {
        restApplicationsMockMvc
            .perform(get("/api/applications").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.backend").value("eureka"))
            .andExpect(jsonPath("$.applications").isArray());
    }

    @Test
    @WithMockUser(username = TEST_USER_LOGIN, authorities = AuthoritiesConstants.ADMIN)
    void shouldGetApplicationsFromEurekaWithTheLegacyEndpoint() throws Exception {
        restApplicationsMockMvc
            .perform(get("/api/eureka/applications").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.applications").isArray());
    }

    @Test
    @WithMockUser(username = TEST_USER_LOGIN)
    void shouldNotGetApplicationsWithoutAdminAuthority() throws Exception {
        restApplicationsMockMvc.perform(get("/api/applications").accept(MediaType.APPLICATION_JSON)).andExpect(status().isForbidden());
    }

    @Test
    void shouldUseEurekaAsApplicationsProvider() {
        assertThat(applicationsProvider).isInstanceOf(EurekaApplicationsProvider.class);
    }
}
