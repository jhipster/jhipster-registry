package io.github.jhipster.registry.client.keycloak;

import org.springframework.core.env.Environment;
import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.core.endpoint.OAuth2AccessTokenResponse;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * KC only sets the 'openid' scope on access tokens but spring uses this scope value(s) for deciding if
 * the user info end-point should be used: It is used only if scopes contains at least one of 'profile, email, address, phone'
 * (see {@link org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService#shouldRetrieveUserInfo} for details).
 *
 * Hence this implementaiton of {@link OAuth2AccessTokenResponseClient} uses the configured
 * 'spring.security.oauth2.client.registration._registrationId_.scope as 'additional scopes'
 * added to {@link OAuth2AccessTokenResponse}.
 *
 * If this value is not given in the configuration, the additional scope 'profile' is used.
 * (This default value also ensures that the user info end-point is used.)
 *
 * @author aanno2
 */
public class KeycloakAccessTokenResponseClient implements OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> {

    protected final Environment environment;

    protected final OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> wrapped;

    public KeycloakAccessTokenResponseClient(Environment env) {
        this(env, new DefaultAuthorizationCodeTokenResponseClient());
    }

    public KeycloakAccessTokenResponseClient(Environment env, OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> wrapped) {
        this.environment = env;
        this.wrapped = wrapped;
    }

    @Override
    public OAuth2AccessTokenResponse getTokenResponse(OAuth2AuthorizationCodeGrantRequest authorizationGrantRequest) {
        String registrationId = authorizationGrantRequest.getClientRegistration().getRegistrationId();
        Set<String> additionalScopes = new HashSet<>();
        String configuredScopes = environment.getProperty(
            "spring.security.oauth2.client.registration." + registrationId + ".scope", "profile");
        Arrays.asList(StringUtils.commaDelimitedListToStringArray(configuredScopes)).stream()
            .map(s -> s.trim())
            .forEach(additionalScopes::add);

        OAuth2AccessTokenResponse result = wrapped.getTokenResponse(authorizationGrantRequest);
        Set<String> scopes = new HashSet<>(result.getAccessToken().getScopes());
        scopes.addAll(additionalScopes);
        return OAuth2AccessTokenResponse.withResponse(result)
            .scopes(scopes)
            .build();
    }
}
