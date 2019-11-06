package io.github.jhipster.registry.config;

import io.github.jhipster.registry.client.keycloak.KeycloakLogoutHandler;
import io.github.jhipster.registry.client.keycloak.KeycloakOidcUserService;
import io.github.jhipster.registry.security.AuthoritiesConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Profile(Constants.PROFILE_OAUTH2)
public class OAuth2SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static final String DEFAULT_AUTHORIZATION_REQUEST_BASE_URI = OAuth2AuthorizationRequestRedirectFilter.DEFAULT_AUTHORIZATION_REQUEST_BASE_URI;

    private static final Logger LOG = LoggerFactory.getLogger(OAuth2SecurityConfiguration.class);

    @Autowired
    private OAuth2LoginAuthenticationFilter oAuth2LoginAuthenticationFilter;

    @Autowired
    private KeycloakLogoutHandler keycloakLogoutHandler;

    @Autowired
    private KeycloakOidcUserService keycloakOidcUserService;

    @Autowired
    private HttpSessionOAuth2AuthorizationRequestRepository httpSessionOAuth2AuthorizationRequestRepository;

    @Autowired
    private OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> oAuth2AccessTokenResponseClient;

    @Value("${kc.realm}")
    private String realm;

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
            // Attention: We don't need/want security for registering at eureka
            .antMatchers("/eureka/**/*")
            // Attention: We don't need/want security for using config server
            .antMatchers("/config/**/*")
            // Attention: We don't need/want security for login stuff
            .antMatchers("/login/**/*")
            // Attention: We don't need/want security for error page
            .antMatchers("/error/**/*")
            .antMatchers("/app/**/*.{js,html}")
            .antMatchers("/swagger-ui/**")
            .antMatchers("/content/**");
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http
            .cors()
        .and()
            .csrf()
            .disable()
            .headers()
            .frameOptions()
            .disable()
        // Currently, we 'store' the oidc/oauth2 stuff with http session
        .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
        .and()
            .addFilterAfter(oAuth2LoginAuthenticationFilter, AbstractPreAuthenticatedProcessingFilter.class)
            .authorizeRequests()
            .antMatchers("/services/**").authenticated()
            .antMatchers("/eureka/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/config/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/api/profile-info").permitAll()
            // Allow logout even the user has logged out before
            .antMatchers("/api/logout").permitAll()
            .antMatchers("/api/**").authenticated()
            .antMatchers("/config/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/management/health").permitAll()
            .antMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN)
        .and()
            // Propagate logouts via /logout to Keycloak
            .logout().addLogoutHandler(keycloakLogoutHandler)
        .and()
            // This is the point where OAuth2 login of Spring 5 gets enabled
            .oauth2Login().userInfoEndpoint().oidcUserService(keycloakOidcUserService)
        .and()
            .authorizationEndpoint().authorizationRequestRepository(httpSessionOAuth2AuthorizationRequestRepository)
        .and()
            .tokenEndpoint().accessTokenResponseClient(oAuth2AccessTokenResponseClient)
        // .and()
            // I don't want a page with different clients as login options
            // So i use the constant from OAuth2AuthorizationRequestRedirectFilter
            // plus the configured realm as immediate redirect to Keycloak
            // .loginPage(DEFAULT_AUTHORIZATION_REQUEST_BASE_URI + "/" + realm);
            ;
        // @formatter:on
    }

}
