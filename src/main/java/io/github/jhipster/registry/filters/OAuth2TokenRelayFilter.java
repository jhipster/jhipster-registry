package io.github.jhipster.registry.filters;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

import io.github.jhipster.registry.config.Constants;
import io.github.jhipster.registry.security.oauth2.AuthorizationHeaderUtil;

import java.util.Optional;

@Component
@Profile(Constants.PROFILE_OAUTH2)
public class OAuth2TokenRelayFilter extends ZuulFilter {

    public static final String AUTHORIZATION_HEADER = "Authorization";
    public AuthorizationHeaderUtil authorizationHeaderUtil;

    public OAuth2TokenRelayFilter(AuthorizationHeaderUtil authorizationHeaderUtil) {
        this.authorizationHeaderUtil = authorizationHeaderUtil;
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        // Add specific authorization headers for OAuth2
        Optional<String> authorizationHeader = authorizationHeaderUtil.getAuthorizationHeader();
        authorizationHeader.ifPresent(s -> ctx.addZuulRequestHeader(AUTHORIZATION_HEADER, s));
        return null;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 10000;
    }
}
