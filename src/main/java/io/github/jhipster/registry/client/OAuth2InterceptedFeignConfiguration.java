package io.github.jhipster.registry.client;

import feign.RequestInterceptor;
import io.github.jhipster.registry.security.oauth2.AuthorizationHeaderUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OAuth2InterceptedFeignConfiguration {

    @Bean(name = "oauth2RequestInterceptor")
    public RequestInterceptor getOAuth2RequestInterceptor() {
        return new TokenRelayRequestInterceptor();
    }
}
