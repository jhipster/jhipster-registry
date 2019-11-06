package io.github.jhipster.registry.web.rest;

import io.github.jhipster.registry.client.keycloak.KeycloakLogoutHandler;
import io.github.jhipster.registry.config.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
* REST controller for managing global OIDC logout.
*/
@RestController
@Profile(Constants.PROFILE_OAUTH2)
public class LogoutResource {

    private static final Logger LOG = LoggerFactory.getLogger(LogoutResource.class);

    private static final String LOGOUT = "/protocol/openid-connect/logout";

    @Value("${kc.realm:#{null}}")
    private String realm;

    @Value("${kc.realm-url:#{null}}")
    private String realmUrl;

    @Autowired
    private Environment env;

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    @Autowired
    private OAuth2AuthorizedClientService clientService;

    @Autowired
    private KeycloakLogoutHandler keycloakLogoutHandler;

    @Autowired(required = false)
    private ClientHttpRequestFactory clientHttpRequestFactory;

    LogoutResource() {
    }

    @PostConstruct
    void init() {
        if (clientHttpRequestFactory == null) {
            clientHttpRequestFactory = new SimpleClientHttpRequestFactory();
        }
    }

    /**
     * {@code POST  /api/logout} : logout the current user.
     *
     * @param request the {@link HttpServletRequest}.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and a body with a global logout URL and ID token.
     */
    @PostMapping("/api/logout")
    public ResponseEntity<Map<String, String>> logout(
        HttpServletRequest request, HttpServletResponse response, Authentication authentication, HttpSession session)
        throws IOException {

        final OAuth2AuthorizedClient client;
        final ClientRegistration registration;

        // TODO: logout with other types of Authentication
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            String name = oauthToken.getName();
            String registrationId = oauthToken.getAuthorizedClientRegistrationId();
            registration = clientRegistrationRepository.findByRegistrationId(registrationId);
            client = clientService.loadAuthorizedClient(registrationId, name);

            clientService.removeAuthorizedClient(registrationId, name);
            oauthToken.setAuthenticated(false);
        } else {
            registration = null;
            client = null;
        }

        Map<String, String> logoutDetails = new HashMap<>();
        if (registration != null) {
            Map<String, Object> metadata = registration.getProviderDetails().getConfigurationMetadata();
            if (metadata != null) {
                Object endPoint = metadata.get("end_session_endpoint");
                if (endPoint != null) {
                    logoutDetails.put("logoutUrl", endPoint.toString());
                }
            }
        }
        keycloakLogoutHandler.logout(request, response, authentication);

        return ResponseEntity.ok().body(logoutDetails);
    }
}
