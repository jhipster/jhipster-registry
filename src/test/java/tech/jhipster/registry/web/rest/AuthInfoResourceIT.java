package tech.jhipster.registry.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tech.jhipster.registry.JHipsterRegistryApp;
import tech.jhipster.registry.config.TestSecurityConfiguration;
import tech.jhipster.registry.security.AuthoritiesConstants;

/**
 * Integration tests for the {@link AuthInfoResource} REST controller.
 */
@AutoConfigureMockMvc
@SpringBootTest(classes = { JHipsterRegistryApp.class, TestSecurityConfiguration.class })
@ActiveProfiles(profiles = { "native", "oauth2" })
class AuthInfoResourceIT {

    static final String TEST_USER_LOGIN = "test";

    @Autowired
    private MockMvc restAuthInfoMockMvc;

    private static final String issuer = "http://DO_NOT_CALL:9080/realms/jhipster";

    private static final String clientId = "web_app";

    @Test
    @WithMockUser(username = TEST_USER_LOGIN, authorities = AuthoritiesConstants.ADMIN)
    void testGetAuthInfo() throws Exception {
        restAuthInfoMockMvc
            .perform(get("/api/auth-info").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.issuer").value(issuer))
            .andExpect(jsonPath("$.clientId").value(clientId));
    }

    @Test
    void testAuthInfoVM() {
        AuthInfoResource.AuthInfoVM authInfo = new AuthInfoResource.AuthInfoVM("", "");
        authInfo.setIssuer(issuer);
        authInfo.setClientId(clientId);
        assertThat(authInfo.getIssuer()).isEqualTo(issuer);
        assertThat(authInfo.getClientId()).isEqualTo(clientId);
    }
}
