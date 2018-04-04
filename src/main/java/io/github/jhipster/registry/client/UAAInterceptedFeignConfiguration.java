package io.github.jhipster.registry.client;

import feign.RequestInterceptor;
import io.github.jhipster.registry.config.Constants;
import io.github.jhipster.security.uaa.LoadBalancedResourceDetails;
import org.springframework.cloud.security.oauth2.client.feign.OAuth2FeignRequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.client.DefaultOAuth2ClientContext;

import java.io.IOException;

@Configuration
@Profile(Constants.PROFILE_UAA  )
public class UAAInterceptedFeignConfiguration {

    private final LoadBalancedResourceDetails loadBalancedResourceDetails;

    public UAAInterceptedFeignConfiguration(LoadBalancedResourceDetails loadBalancedResourceDetails) {
        this.loadBalancedResourceDetails = loadBalancedResourceDetails;
    }

    @Bean(name = "oauth2RequestInterceptor")
    public RequestInterceptor getOAuth2RequestInterceptor() throws IOException {
        return new OAuth2FeignRequestInterceptor(new DefaultOAuth2ClientContext(), loadBalancedResourceDetails);
    }
}
