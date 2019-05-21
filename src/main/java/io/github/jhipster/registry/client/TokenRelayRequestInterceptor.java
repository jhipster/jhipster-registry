package io.github.jhipster.registry.client;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import io.github.jhipster.registry.security.oauth2.AuthorizationHeaderUtil;

import java.util.Optional;

public class TokenRelayRequestInterceptor implements RequestInterceptor {

    private static final String AUTHORIZATION = "Authorization";

    private final AuthorizationHeaderUtil authorizationHeaderUtil;

    TokenRelayRequestInterceptor(AuthorizationHeaderUtil authorizationHeaderUtil) {
        super();
        this.authorizationHeaderUtil = authorizationHeaderUtil;
    }

    @Override
    public void apply(RequestTemplate template) {
        Optional<String> authorizationHeader = authorizationHeaderUtil.getAuthorizationHeader();
        authorizationHeader.ifPresent(s -> template.header(AUTHORIZATION, s));
    }
}
