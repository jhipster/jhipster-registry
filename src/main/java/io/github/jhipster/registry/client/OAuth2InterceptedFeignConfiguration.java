package io.github.jhipster.registry.client;

import java.io.IOException;

import io.github.jhipster.registry.config.Constants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile(Constants.PROFILE_OAUTH2)
public class OAuth2InterceptedFeignConfiguration {

    @Bean(name = "oauth2RequestInterceptor")
    public RequestInterceptor getOAuth2RequestInterceptor() throws IOException {
        return new TokenRelayRequestInterceptor();
    }
}
