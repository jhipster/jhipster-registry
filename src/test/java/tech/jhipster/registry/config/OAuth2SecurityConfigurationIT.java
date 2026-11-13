package tech.jhipster.registry.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tech.jhipster.registry.JHipsterRegistryApp;

@AutoConfigureMockMvc
@SpringBootTest(classes = { JHipsterRegistryApp.class, TestSecurityConfiguration.class })
@ActiveProfiles(profiles = { "native", "oauth2" })
class OAuth2SecurityConfigurationIT {

    @Autowired
    private MockMvc mockMvc;

    /**
     * The client sends this Accept header. It must get a 401, which it handles, and not a redirect to the identity provider.
     */
    @Test
    void shouldAnswerUnauthorizedToAnApiCallOfTheClient() throws Exception {
        mockMvc
            .perform(get("/api/eureka/applications").header(HttpHeaders.ACCEPT, "application/json, text/plain, */*"))
            .andExpect(status().isUnauthorized())
            .andExpect(header().doesNotExist(HttpHeaders.LOCATION));
    }

    @Test
    void shouldRequireAuthenticationForThePrometheusEndpoint() throws Exception {
        mockMvc.perform(get("/management/prometheus")).andExpect(status().isUnauthorized());
    }
}
