package tech.jhipster.registry.config;

import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static tech.jhipster.registry.security.SecurityUtils.AUTHORITIES_CLAIM;
import static tech.jhipster.registry.security.SecurityUtils.JWT_ALGORITHM;

import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
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

    @Test
    void shouldNotReportAuthenticationFactorsAsAuthorities() throws Exception {
        String response = mockMvc
            .perform(
                post("/api/authenticate").contentType(MediaType.APPLICATION_JSON).content("{\"username\":\"test\",\"password\":\"test\"}")
            )
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
        String token = response.replaceAll(".*\"id_token\"\\s*:\\s*\"([^\"]+)\".*", "$1");

        mockMvc
            .perform(get("/api/account").header(AUTHORIZATION, "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.authorities", hasItems("ROLE_ADMIN", "ROLE_USER")))
            .andExpect(jsonPath("$.authorities", everyItem(startsWith("ROLE_"))));
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
