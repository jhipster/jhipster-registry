package io.github.jhipster.registry.client;

import io.github.jhipster.registry.security.oauth2.AuthorizationHeaderUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Profile;

import static io.github.jhipster.registry.config.Constants.PROFILE_OAUTH2;

@Configuration
@Profile(PROFILE_OAUTH2)
public class OAuth2InterceptedFeignConfiguration {

    @Bean(name = "oauth2RequestInterceptor")
    public RequestInterceptor getOAuth2RequestInterceptor(AuthorizationHeaderUtil headerUtil) {
        return new TokenRelayRequestInterceptor(headerUtil);
    }
}
