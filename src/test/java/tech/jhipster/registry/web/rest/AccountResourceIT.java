package tech.jhipster.registry.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static tech.jhipster.registry.web.rest.AccountResourceIT.TEST_USER_LOGIN;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import tech.jhipster.registry.IntegrationTest;
import tech.jhipster.registry.security.AuthoritiesConstants;

/**
 * Integration tests for the {@link AccountResource} REST controller.
 */
@AutoConfigureMockMvc
@WithMockUser(value = TEST_USER_LOGIN)
@IntegrationTest
class AccountResourceIT {

    static final String TEST_USER_LOGIN = "test";

    @Autowired
    private MockMvc restAccountMockMvc;

    @Test
    @WithMockUser(username = TEST_USER_LOGIN, authorities = AuthoritiesConstants.ADMIN)
    void testGetExistingAccount() throws Exception {
        restAccountMockMvc
            .perform(get("/api/account").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.login").value(TEST_USER_LOGIN))
            .andExpect(jsonPath("$.authorities").value(AuthoritiesConstants.ADMIN));
    }

    @Test
    @WithUnauthenticatedMockUser
    void testNonAuthenticatedUser() throws Exception {
        restAccountMockMvc
            .perform(get("/api/authenticate").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().string(""));
    }

    @Test
    void testAuthenticatedUser() throws Exception {
        restAccountMockMvc
            .perform(
                get("/api/authenticate")
                    .with(request -> {
                        request.setRemoteUser(TEST_USER_LOGIN);
                        return request;
                    })
                    .accept(MediaType.APPLICATION_JSON)
            )
            .andExpect(status().isOk())
            .andExpect(content().string(TEST_USER_LOGIN));
    }
}
