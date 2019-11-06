package io.github.jhipster.registry.config;

import io.github.jhipster.registry.client.keycloak.KeycloakAccessTokenResponseClient;
import io.github.jhipster.registry.client.keycloak.KeycloakAuthoritiesMapper;
import io.github.jhipster.registry.client.keycloak.KeycloakLogoutHandler;
import io.github.jhipster.registry.client.keycloak.KeycloakOidcUserService;
import io.github.jhipster.registry.security.oauth2.AudienceValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.oidc.authentication.OidcAuthorizationCodeAuthenticationProvider;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Configuration
@Profile(Constants.PROFILE_OAUTH2)
public class OAuth2SecurityBeanConfiguration {

    private static final Logger LOG = LoggerFactory.getLogger(OAuth2SecurityBeanConfiguration.class);

    @Value("${kc.base-url}")
    private String kcBaseUrl;

    @Value("${kc.realm}")
    private String realm;

    public OAuth2SecurityBeanConfiguration() {
    }

    @Bean
    public SecurityContextPersistenceFilter securityContextPersistenceFilter() {
        SecurityContextPersistenceFilter result = new SecurityContextPersistenceFilter();
        return result;
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Bean
    public SessionAuthenticationStrategy sessionAuthenticationStrategy(SessionRegistry sessionRegistry) {
        return new RegisterSessionAuthenticationStrategy(sessionRegistry);
    }

    @Bean
    public OAuth2LoginAuthenticationFilter oAuth2LoginAuthenticationFilter(
        ClientRegistrationRepository clientRegistrationRepository, OAuth2AuthorizedClientService authorizedClientService,
        AuthenticationManager authenticationManager, SessionAuthenticationStrategy sessionAuthenticationStrategy) {
        OAuth2LoginAuthenticationFilter result = new OAuth2LoginAuthenticationFilter(
            clientRegistrationRepository, authorizedClientService);
        result.setAuthenticationManager(authenticationManager);
        result.setSessionAuthenticationStrategy(sessionAuthenticationStrategy);
        return result;
    }

    @Bean
    public OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> oAuth2AccessTokenResponseClient(Environment env) {
        OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> result = new KeycloakAccessTokenResponseClient(env);
        return result;
    }

    @Bean
    public HttpSessionOAuth2AuthorizationRequestRepository httpSessionOAuth2AuthorizationRequestRepository() {
        HttpSessionOAuth2AuthorizationRequestRepository result = new HttpSessionOAuth2AuthorizationRequestRepository();
        return result;
    }

    @Bean
    public OidcAuthorizationCodeAuthenticationProvider oidcAuthorizationCodeAuthenticationProvider(
        OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> accessTokenResponseClient,
        KeycloakOidcUserService userService) {
        OidcAuthorizationCodeAuthenticationProvider result = new OidcAuthorizationCodeAuthenticationProvider(
            accessTokenResponseClient, userService);
        return result;
    }

    @Bean
    public AuthenticationManager authenticationManager(OidcAuthorizationCodeAuthenticationProvider p0) {
        // Potentially there could be more AuthenticationProviders...
        AuthenticationProvider[] array = new AuthenticationProvider[]{p0};
        ProviderManager result = new ProviderManager(Arrays.asList(array));
        return result;
    }

    @Bean
    public KeycloakOidcUserService keycloakOidcUserService() {

        KeycloakOidcUserService result = new KeycloakOidcUserService();
        return result;
    }

    @Bean
    public KeycloakLogoutHandler keycloakLogoutHandler(/* RestTemplate restTemplate */) {
        KeycloakLogoutHandler result = new KeycloakLogoutHandler();
        result.setRestTemplate(new RestTemplate());
        return result;
    }

    @Bean
    @SuppressWarnings("unchecked")
    public GrantedAuthoritiesMapper userAuthoritiesMapper() {
        KeycloakAuthoritiesMapper result = new KeycloakAuthoritiesMapper();
        return result;
    }

    @Bean
    public JwtDecoder jwtDecoder(AudienceValidator av) {
        String issuerUri = kcBaseUrl + "/realms/" + realm;
        NimbusJwtDecoderJwkSupport jwtDecoder = (NimbusJwtDecoderJwkSupport)
            JwtDecoders.fromOidcIssuerLocation(issuerUri);

        OAuth2TokenValidator<Jwt> audienceValidator = av;
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuerUri);
        OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator);

        jwtDecoder.setJwtValidator(withAudience);

        return jwtDecoder;
    }
}
