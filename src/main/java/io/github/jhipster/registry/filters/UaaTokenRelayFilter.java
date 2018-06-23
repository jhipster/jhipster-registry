package io.github.jhipster.registry.filters;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import io.github.jhipster.registry.security.oauth2.OAuth2ClientCredentialsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import static io.github.jhipster.registry.config.Constants.PROFILE_UAA;
import static io.github.jhipster.registry.filters.OAuth2TokenRelayFilter.AUTHORIZATION_HEADER;

@Component
@Profile(PROFILE_UAA)
public class UaaTokenRelayFilter extends ZuulFilter {

    Logger log = LoggerFactory.getLogger(UaaTokenRelayFilter.class);

    private OAuth2ClientCredentialsService oauth2clientCredentialsService;

    public UaaTokenRelayFilter(OAuth2ClientCredentialsService oauth2clientCredentialsService) {
        this.oauth2clientCredentialsService = oauth2clientCredentialsService;
    }


    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public boolean shouldFilter() {
        RequestContext ctx = RequestContext.getCurrentContext();

        return ctx.getRequest().getRequestURI().startsWith("/services");
    }

    @Override
    public Object run() throws ZuulException {

        RequestContext ctx = RequestContext.getCurrentContext();
        // Add specific authorization headers for OAuth2
        ctx.addZuulRequestHeader(AUTHORIZATION_HEADER,
            "Bearer " + oauth2clientCredentialsService.getAccessToken());

        return null;
    }
}
