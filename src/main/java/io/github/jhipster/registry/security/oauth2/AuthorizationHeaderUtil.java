package io.github.jhipster.registry.security.oauth2;

import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Component;

import java.util.Optional;

import static io.github.jhipster.registry.config.Constants.PROFILE_OAUTH2;

@Component
@Profile(PROFILE_OAUTH2)
public class AuthorizationHeaderUtil {

    private final OAuth2AuthorizedClientService clientService;

    public AuthorizationHeaderUtil(OAuth2AuthorizedClientService clientService) {
        this.clientService = clientService;
    }

    public Optional<String> getAuthorizationHeader() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
            oauthToken.getAuthorizedClientRegistrationId(),
            oauthToken.getName());

        OAuth2AccessToken accessToken = client.getAccessToken();

        if (accessToken == null) {
            return Optional.empty();
        } else {
            OAuth2AccessToken.TokenType tokenType = accessToken.getTokenType();
            String authorizationHeaderValue = String.format("%s %s", tokenType, accessToken.getTokenValue());
            return Optional.of(authorizationHeaderValue);
        }
    }
}
