package io.github.jhipster.registry.config.uaa;

import io.github.jhipster.registry.config.Constants;
import io.github.jhipster.registry.security.AuthoritiesConstants;
import io.github.jhipster.registry.security.uaa.CookieTokenExtractor;
import io.github.jhipster.registry.security.uaa.OAuth2AuthenticationService;
import io.github.jhipster.registry.security.uaa.OAuth2CookieHelper;
import io.github.jhipster.registry.security.uaa.OAuth2TokenEndpointClient;
import io.github.jhipster.registry.web.filter.RefreshTokenFilterConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.authentication.TokenExtractor;
import org.springframework.security.oauth2.provider.token.TokenStore;

/**
 * Configures the RefreshFilter refreshing expired OAuth2 token Cookies.
 */
@Configuration
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Profile(Constants.PROFILE_UAA)
public class OAuth2AuthenticationConfiguration extends ResourceServerConfigurerAdapter {
    private final OAuth2Properties oAuth2Properties;
    private final OAuth2TokenEndpointClient tokenEndpointClient;
    private final TokenStore tokenStore;

    public OAuth2AuthenticationConfiguration(OAuth2Properties oAuth2Properties, OAuth2TokenEndpointClient tokenEndpointClient, TokenStore tokenStore) {
        this.oAuth2Properties = oAuth2Properties;
        this.tokenEndpointClient = tokenEndpointClient;
        this.tokenStore = tokenStore;
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .antMatchers("/eureka/**").permitAll()
            .antMatchers("/config/**").permitAll()
            .antMatchers("/auth/login").permitAll()
            .antMatchers("/auth/logout").authenticated()
            .and()
            .apply(refreshTokenSecurityConfigurerAdapter());
    }

    /**
     * A SecurityConfigurerAdapter to install a servlet filter that refreshes OAuth2 tokens.
     */
    private RefreshTokenFilterConfigurer refreshTokenSecurityConfigurerAdapter() {
        return new RefreshTokenFilterConfigurer(uaaAuthenticationService(), tokenStore);
    }

    @Bean
    public OAuth2CookieHelper cookieHelper() {
        return new OAuth2CookieHelper(oAuth2Properties);
    }

    @Bean
    public OAuth2AuthenticationService uaaAuthenticationService() {
        return new OAuth2AuthenticationService(tokenEndpointClient, cookieHelper());
    }

    /**
     * Configure the ResourceServer security by installing a new TokenExtractor.
     */
    @Override
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
        resources.tokenExtractor(tokenExtractor());
    }

    /**
     * The new TokenExtractor can extract tokens from Cookies and Authorization headers.
     *
     * @return the CookieTokenExtractor bean.
     */
    @Bean
    public TokenExtractor tokenExtractor() {
        return new CookieTokenExtractor();
    }

}
