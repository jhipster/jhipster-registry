package tech.jhipster.registry.web.rest;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tech.jhipster.registry.security.jwt.JwtAuthenticationTestUtils.BEARER;
import static tech.jhipster.registry.security.jwt.JwtAuthenticationTestUtils.createValidTokenForUser;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import tech.jhipster.registry.IntegrationTest;
import tech.jhipster.registry.security.AuthoritiesConstants;

/**
 * Integration tests for the {@link AccountResource} REST controller.
 */
@AutoConfigureMockMvc
@IntegrationTest
class AccountResourceIT {

    static final String TEST_USER_LOGIN = "test";

    @Autowired
    private MockMvc restAccountMockMvc;

    @Value("${jhipster.security.authentication.jwt.base64-secret}")
    private String jwtKey;

    @Test
    void testGetExistingAccount() throws Exception {
        restAccountMockMvc
            .perform(
                get("/api/account")
                    .accept(MediaType.APPLICATION_JSON)
                    .header(AUTHORIZATION, BEARER + createValidTokenForUser(jwtKey, TEST_USER_LOGIN))
            )
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.login").value(TEST_USER_LOGIN))
            .andExpect(jsonPath("$.authorities", hasItem(AuthoritiesConstants.ADMIN)));
    }

    @Test
    @WithUnauthenticatedMockUser
    void testNonAuthenticatedUser() throws Exception {
        restAccountMockMvc.perform(get("/api/authenticate")).andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(TEST_USER_LOGIN)
    void testAuthenticatedUser() throws Exception {
        restAccountMockMvc.perform(get("/api/authenticate").with(request -> request)).andExpect(status().isNoContent());
    }
}
