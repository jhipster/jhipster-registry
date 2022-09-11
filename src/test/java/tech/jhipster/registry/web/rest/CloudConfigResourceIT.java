package tech.jhipster.registry.web.rest;

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
import tech.jhipster.registry.security.AuthoritiesConstants;

/**
 * Integration tests for the {@link CloudConfigResource} REST controller.
 */
@AutoConfigureMockMvc
@IntegrationTest
class CloudConfigResourceIT {

    static final String TEST_USER_LOGIN = "test";

    @Autowired
    private MockMvc restConfigCloudMockMvc;

    @Test
    @WithMockUser(username = TEST_USER_LOGIN, authorities = AuthoritiesConstants.ADMIN)
    void shouldGetConfigurationSources() throws Exception {
        restConfigCloudMockMvc
            .perform(get("/api/config/sources").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.label").value("main"))
            .andExpect(jsonPath("$.serverConfigurationSources[0].type").value("git"))
            .andExpect(jsonPath("$.serverConfigurationSources[0].uri").value("https://github.com/jhipster/jhipster-registry-sample-config"))
            .andExpect(jsonPath("$.serverConfigurationSources[0].ignore-local-ssh-settings").value(true))
            .andExpect(jsonPath("$.serverConfigurationSources[0].private-key").value("my-private-key"));
    }

    @Test
    @WithMockUser(username = TEST_USER_LOGIN)
    void shouldNotGetConfigurationSources() throws Exception {
        restConfigCloudMockMvc.perform(get("/api/config/sources").accept(MediaType.APPLICATION_JSON)).andExpect(status().isForbidden());
    }
}
