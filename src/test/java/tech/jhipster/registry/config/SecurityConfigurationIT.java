package tech.jhipster.registry.config;

import static org.hamcrest.Matchers.hasItems;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static tech.jhipster.registry.security.SecurityUtils.AUTHORITIES_CLAIM;
import static tech.jhipster.registry.security.SecurityUtils.JWT_ALGORITHM;

import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.test.web.servlet.MockMvc;
import tech.jhipster.registry.IntegrationTest;

@AutoConfigureMockMvc
@IntegrationTest
class SecurityConfigurationIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtEncoder jwtEncoder;

    @Test
    void shouldRequireAuthenticationForThePrometheusEndpoint() throws Exception {
        mockMvc.perform(get("/management/prometheus")).andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReadAuthoritiesSeparatedBySpaces() throws Exception {
        mockMvc
            .perform(get("/api/account").header(AUTHORIZATION, "Bearer " + token("ROLE_ADMIN ROLE_USER")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.authorities", hasItems("ROLE_ADMIN", "ROLE_USER")));
    }

    /**
     * Releases before 8.0.0 separated the authorities with commas, and their tokens can still be valid after an upgrade.
     */
    @Test
    void shouldReadAuthoritiesSeparatedByCommas() throws Exception {
        mockMvc
            .perform(get("/api/account").header(AUTHORIZATION, "Bearer " + token("ROLE_ADMIN,ROLE_USER")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.authorities", hasItems("ROLE_ADMIN", "ROLE_USER")));
    }

    private String token(String authorities) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .subject("admin")
            .issuedAt(now)
            .expiresAt(now.plusSeconds(60))
            .claim(AUTHORITIES_CLAIM, authorities)
            .build();
        return jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(JWT_ALGORITHM).build(), claims)).getTokenValue();
    }
}
