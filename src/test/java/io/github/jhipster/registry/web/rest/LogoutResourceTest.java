package io.github.jhipster.registry.web.rest;

import io.github.jhipster.registry.JHipsterRegistryApp;
import io.github.jhipster.registry.config.Constants;
import io.github.jhipster.registry.config.TestSecurityConfiguration;
import io.github.jhipster.registry.security.AuthoritiesConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link LogoutResource} REST controller.
 */
@SpringBootTest(classes = {JHipsterRegistryApp.class, TestSecurityConfiguration.class})
@ActiveProfiles("oauth2")
public class LogoutResourceTest {

    @Autowired
    private ClientRegistrationRepository registrations;

    @Autowired
    private WebApplicationContext context;

    private final static String ID_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9" +
        ".eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsIm" +
        "p0aSI6ImQzNWRmMTRkLTA5ZjYtNDhmZi04YTkzLTdjNmYwMzM5MzE1OSIsImlhdCI6MTU0M" +
        "Tk3MTU4MywiZXhwIjoxNTQxOTc1MTgzfQ.QaQOarmV8xEUYV7yvWzX3cUE_4W1luMcWCwpr" +
        "oqqUrg";

    private MockMvc restLogoutMockMvc;

    @BeforeEach
    public void before() throws Exception {
        Map<String, Object> claims = new HashMap<>();
        claims.put("groups", "ROLE_USER");
        claims.put("sub", 123);
        OidcIdToken idToken = new OidcIdToken(ID_TOKEN, Instant.now(),
            Instant.now().plusSeconds(60), claims);
        SecurityContextHolder.getContext().setAuthentication(authenticationToken(idToken));
        SecurityContextHolderAwareRequestFilter authInjector = new SecurityContextHolderAwareRequestFilter();
        authInjector.afterPropertiesSet();

        this.restLogoutMockMvc = MockMvcBuilders.webAppContextSetup(this.context).build();
    }

    @Test
    public void getLogoutInformation() throws Exception {
        String logoutUrl = this.registrations.findByRegistrationId("oidc").getProviderDetails()
            .getConfigurationMetadata().get("end_session_endpoint").toString();
        restLogoutMockMvc.perform(post("/api/logout"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.logoutUrl").value(logoutUrl))
            .andExpect(jsonPath("$.idToken").value(ID_TOKEN));
    }

    private OAuth2AuthenticationToken authenticationToken(OidcIdToken idToken) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
        OidcUser user = new DefaultOidcUser(authorities, idToken);
        return new OAuth2AuthenticationToken(user, authorities, "oidc");
    }
}
