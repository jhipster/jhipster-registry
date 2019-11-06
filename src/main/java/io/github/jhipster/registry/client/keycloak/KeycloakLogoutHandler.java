package io.github.jhipster.registry.client.keycloak;

import com.netflix.discovery.converters.Auto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Stolen from https://github.com/thomasdarimont/spring-boot-2-keycloak-oauth-example.git
 *
 * Propagates logouts to Keycloak.
 *
 * Necessary because Spring Security 5 (currently) doesn't support
 * end-session-endpoints.
 *
 * Modified by aanno2
 */
public class KeycloakLogoutHandler extends SecurityContextLogoutHandler {

    private static final Logger LOG = LoggerFactory.getLogger(KeycloakLogoutHandler.class);

    @Autowired(required = false)
	private RestTemplate restTemplate = new RestTemplate();

    public KeycloakLogoutHandler() {
    }

    public void setRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
	public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
		super.logout(request, response, authentication);

		if (authentication != null) {
		    if (authentication.getPrincipal() instanceof OidcUser) {
                propagateLogoutToKeycloak((OidcUser) authentication.getPrincipal());
            }
        }
	}

	private void propagateLogoutToKeycloak(OidcUser user) {

		String endSessionEndpoint = user.getIssuer() + "/protocol/openid-connect/logout";

		UriComponentsBuilder builder = UriComponentsBuilder //
				.fromUriString(endSessionEndpoint) //
				.queryParam("id_token_hint", user.getIdToken().getTokenValue());

		ResponseEntity<String> logoutResponse = restTemplate.getForEntity(builder.toUriString(), String.class);
		if (logoutResponse.getStatusCode().is2xxSuccessful()) {
			LOG.info("Successfulley logged out in Keycloak");
		} else {
			LOG.info("Could not propagate logout to Keycloak: " + logoutResponse.getStatusCode());
		}
	}
}

