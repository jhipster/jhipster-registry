package io.github.jhipster.registry.client;

import java.io.IOException;

import io.github.jhipster.registry.security.oauth2.AuthorizationHeaderUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.RequestInterceptor;

@Configuration
public class OAuth2InterceptedFeignConfiguration {

    @Bean(name = "oauth2RequestInterceptor")
    public RequestInterceptor getOAuth2RequestInterceptor(AuthorizationHeaderUtil headerUtil) {
        return new TokenRelayRequestInterceptor(headerUtil);
    }
}
