package io.github.jhipster.registry.security.uaa;

import io.github.jhipster.registry.JHipsterRegistryApp;
import io.github.jhipster.registry.config.UaaTestSecurityConfiguration;
import io.github.jhipster.registry.security.AuthoritiesConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.endpoint.OAuth2AccessTokenResponse;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;

import static io.github.jhipster.registry.config.UaaConfiguration.CLIENT_REGISTRATION_ID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;

@SpringBootTest(classes = {JHipsterRegistryApp.class, UaaTestSecurityConfiguration.class})
@TestPropertySource(properties = "eureka.client.fetch-registry: false")
@ActiveProfiles("uaa")
public class UaaAuthorizationHeaderUtilIT {

    @MockBean(name = "uaaRestTemplate")
    private RestTemplate restTemplate;

    @Autowired
    private UaaAuthorizationHeaderUtil authorizationHeaderUtil;

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    private Authentication authentication;

    @BeforeEach
    public void setup() {
        authentication = createAuthentication();
        SecurityContextHolder.getContext().setAuthentication(authentication);

        authorizedClientService.removeAuthorizedClient(CLIENT_REGISTRATION_ID, authentication.getName());
    }

    @Test
    public void testAuthorizationHeaderWithExistingAuthorizedClient() {
        // GIVEN
        OAuth2AccessToken accessToken = new OAuth2AccessToken(
            OAuth2AccessToken.TokenType.BEARER,
            "existingTokenValue",
            Instant.now().minus(Duration.ofHours(1)),
            Instant.now().plus(Duration.ofHours(1)));
        authorizedClientService.saveAuthorizedClient(createAuthorizedClient(accessToken), authentication);

        String authorizationHeader = authorizationHeaderUtil.getAuthorizationHeader();

        assertThat(authorizationHeader).isNotEmpty();
        assertThat(authorizationHeader).isEqualTo("Bearer existingTokenValue");
    }

    @Test
    public void testAuthorizationHeaderWithNotExistingAuthorizedClient() {
        doReturn(ResponseEntity.ok(createAccessTokenResponse("tokenValue")))
            .when(restTemplate).exchange(any(RequestEntity.class), ArgumentMatchers.<Class<OAuth2AccessTokenResponse>>any());

        String authorizationHeader = authorizationHeaderUtil.getAuthorizationHeader();

        assertThat(authorizationHeader).isNotEmpty();
        assertThat(authorizationHeader).isEqualTo("Bearer tokenValue");
    }

    @Test
    public void testAuthorizationHeaderWithExpiredAccessToken() {
        OAuth2AccessToken accessToken = new OAuth2AccessToken(
            OAuth2AccessToken.TokenType.BEARER,
            "existingTokenValue",
            Instant.now().minus(Duration.ofHours(1)),
            Instant.now().minus(Duration.ofMinutes(2)));
        authorizedClientService.saveAuthorizedClient(createAuthorizedClient(accessToken), authentication);

        doReturn(ResponseEntity.ok(createAccessTokenResponse("refreshTokenValue")))
            .when(restTemplate).exchange(any(RequestEntity.class), ArgumentMatchers.<Class<OAuth2AccessTokenResponse>>any());

        String authorizationHeader = authorizationHeaderUtil.getAuthorizationHeader();

        assertThat(authorizationHeader).isNotEmpty();
        assertThat(authorizationHeader).isEqualTo("Bearer refreshTokenValue");
    }

    private OAuth2AuthorizedClient createAuthorizedClient(OAuth2AccessToken accessToken) {
        ClientRegistration clientRegistration = clientRegistrationRepository.findByRegistrationId(CLIENT_REGISTRATION_ID);
        return new OAuth2AuthorizedClient(clientRegistration, authentication.getName(), accessToken);
    }

    private Authentication createAuthentication() {
        return new UsernamePasswordAuthenticationToken(
            "test-user",
            "test-password",
            Collections.singletonList(new SimpleGrantedAuthority(AuthoritiesConstants.USER))
        );
    }

    private OAuth2AccessTokenResponse createAccessTokenResponse(String tokenValue) {
        return OAuth2AccessTokenResponse
            .withToken(tokenValue)
            .tokenType(OAuth2AccessToken.TokenType.BEARER)
            .expiresIn(Instant.now().plusSeconds(3600).getEpochSecond())
            .build();
    }
}
