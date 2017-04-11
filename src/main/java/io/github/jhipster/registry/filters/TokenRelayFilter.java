package io.github.jhipster.registry.filters;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class TokenRelayFilter extends ZuulFilter {

    @Override
    public Object run() {
        Object contextGet = RequestContext.getCurrentContext().get("ignoredHeaders");
        if(contextGet!=null) ((Set) contextGet).remove("authorization"); // We need our JWT tokens relayed to resource servers
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
