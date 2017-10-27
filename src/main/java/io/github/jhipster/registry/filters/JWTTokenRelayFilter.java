package io.github.jhipster.registry.filters;

import java.util.Set;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

import io.github.jhipster.registry.config.Constants;
import io.github.jhipster.registry.security.oauth2.AuthorizationHeaderUtil;

@Component
@Profile("!" + Constants.PROFILE_OAUTH2)
public class JWTTokenRelayFilter extends ZuulFilter {

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        Set<String> headers = (Set<String>) ctx.get("ignoredHeaders");
        // JWT tokens should be relayed to the resource servers
        headers.remove("authorization");
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
