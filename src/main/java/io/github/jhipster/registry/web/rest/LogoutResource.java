package io.github.jhipster.registry.web.rest;

import io.github.jhipster.registry.config.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
* REST controller for managing global OIDC logout.
*/
@RestController
@Profile(Constants.PROFILE_OAUTH2)
public class LogoutResource {

    private static final Logger LOG = LoggerFactory.getLogger(LogoutResource.class);

    private static final String LOGOUT = "/protocol/openid-connect/logout";

    @Value("${spring.security.oauth2.client.provider.oidc.issuer-uri}")
    private String issuerUri;

    @Value("${spring.security.oauth2.client.registration.oidc.client-id}")
    private String clientId;

    @Autowired
    private OAuth2ClientContext clientContext;

    private ClientRegistration registration;

    public LogoutResource(ClientRegistrationRepository registrations) {
        this.registration = registrations.findByRegistrationId("oidc");
    }

    /**
     * {@code POST  /api/logout} : logout the current user.
     *
     * @param request the {@link HttpServletRequest}.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and a body with a global logout URL and ID token.
     */
    @PostMapping("/api/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response,
        Authentication authentication, HttpSession session) throws IOException {
        String logoutUrl = this.registration.getProviderDetails()
            .getConfigurationMetadata().get("end_session_endpoint").toString();

        Map<String, String> logoutDetails = new HashMap<>();
        logoutDetails.put("logoutUrl", logoutUrl);

        String refreshToken = clientContext.getAccessToken().getRefreshToken().getValue();
        clientContext.setAccessToken(null);
        SecurityContextLogoutHandler handler = new SecurityContextLogoutHandler();
        handler.logout(request, response, authentication);

        return ResponseEntity.ok().body(logoutDetails);
    }
}
