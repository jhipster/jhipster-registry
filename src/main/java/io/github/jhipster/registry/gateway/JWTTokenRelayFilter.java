package io.github.jhipster.registry.gateway;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

import java.util.Set;

import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;

public class JWTTokenRelayFilter extends ZuulFilter {

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        @SuppressWarnings("unchecked")
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
        return PRE_TYPE;
    }

    @Override
    public int filterOrder() {
        return 10000;
    }
}
