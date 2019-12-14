package io.github.jhipster.registry.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.client.InMemoryOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;

import static io.github.jhipster.registry.config.UaaConfiguration.CLIENT_REGISTRATION_ID;

/**
 * This class allows you to run unit and integration tests without an UAA.
 */
@TestConfiguration
public class UaaTestSecurityConfiguration {
    private final ClientRegistration clientRegistration;

    public UaaTestSecurityConfiguration() {
        this.clientRegistration = clientRegistration().build();
    }

    @Bean
    ClientRegistrationRepository clientRegistrationRepository() {
        return new InMemoryClientRegistrationRepository(clientRegistration);
    }

    private ClientRegistration.Builder clientRegistration() {
        return ClientRegistration.withRegistrationId(CLIENT_REGISTRATION_ID)
            .authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS)
            .tokenUri("https://uaa/oauth/token")
            .clientName("Client Name")
            .clientId("client-id")
            .clientSecret("client-secret");
    }

    @Bean
    public OAuth2AuthorizedClientService authorizedClientService(ClientRegistrationRepository clientRegistrationRepository) {
        return new InMemoryOAuth2AuthorizedClientService(clientRegistrationRepository);
    }

}
