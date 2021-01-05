package io.github.jhipster.registry.security.uaa;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthorizationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.endpoint.OAuth2AccessTokenResponse;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.util.Objects;
import java.util.Optional;

import static io.github.jhipster.registry.config.Constants.PROFILE_UAA;
import static io.github.jhipster.registry.config.UaaConfiguration.CLIENT_REGISTRATION_ID;

@Service
@Profile(PROFILE_UAA)
public class UaaAuthorizationHeaderUtil {

    private final Logger log = LoggerFactory.getLogger(OAuth2AuthorizedClientService.class);
    private final ClientRegistrationRepository clientRegistrationRepository;
    private final OAuth2AuthorizedClientService clientRegistrationService;
    private final RestTemplate uaaRestTemplate;

    public UaaAuthorizationHeaderUtil(ClientRegistrationRepository clientRegistrationRepository,
                                      OAuth2AuthorizedClientService clientRegistrationService,
                                      RestTemplate uaaRestTemplate) {
        this.uaaRestTemplate = uaaRestTemplate;
        this.clientRegistrationRepository = clientRegistrationRepository;
        this.clientRegistrationService = clientRegistrationService;
    }

    public String getAuthorizationHeader() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<OAuth2AuthorizedClient> client = Optional.ofNullable(
            clientRegistrationService.loadAuthorizedClient(CLIENT_REGISTRATION_ID, authentication.getName()));

        if (!client.isPresent() || client.get().getAccessToken() == null) {
            log.info("AccessToken not found, refreshing automatically");
            client = refreshAuthorizedClient(authentication);
        } else if (isExpired(client.get().getAccessToken())) {
            log.info("AccessToken expired, refreshing automatically");
            client = refreshAuthorizedClient(authentication);
        }

        return client.map(OAuth2AuthorizedClient::getAccessToken)
            .map(this::toAuthorizationHeaderValue)
            .orElseThrow(() -> new OAuth2AuthorizationException(new OAuth2Error(OAuth2ErrorCodes.UNAUTHORIZED_CLIENT, "Unable to get access token for user", null)));
    }

    private String toAuthorizationHeaderValue(OAuth2AccessToken accessToken) {
        return String.format("%s %s", accessToken.getTokenType().getValue(), accessToken.getTokenValue());
    }

    private Optional<OAuth2AuthorizedClient> refreshAuthorizedClient(Authentication authentication) {
        ClientRegistration clientRegistration = clientRegistrationRepository.findByRegistrationId(CLIENT_REGISTRATION_ID);
        if (clientRegistration == null) {
            throw new IllegalArgumentException("Invalid Client Registration with Id: " + CLIENT_REGISTRATION_ID);
        }

        OAuth2AccessToken accessToken = retrieveNewAccessToken(clientRegistration);
        if (accessToken == null) {
            log.info("Unable to get access token for user");
            return Optional.empty();
        }
        OAuth2AuthorizedClient updatedAuthorizedClient = new OAuth2AuthorizedClient(
            clientRegistration,
            authentication.getName(),
            accessToken
        );
        clientRegistrationService.saveAuthorizedClient(updatedAuthorizedClient, authentication);
        return Optional.of(updatedAuthorizedClient);
    }

    private OAuth2AccessToken retrieveNewAccessToken(ClientRegistration clientRegistration) {
        MultiValueMap<String, String> formParameters = new LinkedMultiValueMap<>();
        formParameters.add(OAuth2ParameterNames.GRANT_TYPE, AuthorizationGrantType.CLIENT_CREDENTIALS.getValue());
        RequestEntity requestEntity = RequestEntity
            .post(URI.create(clientRegistration.getProviderDetails().getTokenUri()))
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(formParameters);

        try {
            ResponseEntity<OAuth2AccessTokenResponse> responseEntity = this.uaaRestTemplate.exchange(requestEntity, OAuth2AccessTokenResponse.class);
            return Objects.requireNonNull(responseEntity.getBody()).getAccessToken();
        } catch (OAuth2AuthorizationException e) {
            log.error("Unable to get access token", e);
            throw new OAuth2AuthenticationException(e.getError(), e);
        }
    }

    private boolean isExpired(OAuth2AccessToken accessToken) {
        Instant now = Instant.now();
        Instant expiresAt = Objects.requireNonNull(accessToken.getExpiresAt());
        return now.isAfter(expiresAt.minus(Duration.ofMinutes(1L)));
    }
}
