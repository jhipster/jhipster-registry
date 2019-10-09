package io.github.jhipster.registry.config;

import io.github.jhipster.registry.security.AuthoritiesConstants;
import io.github.jhipster.registry.security.oauth2.AudienceValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.boot.autoconfigure.security.oauth2.resource.AuthoritiesExtractor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.filter.OAuth2ClientContextFilter;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationManager;
import org.springframework.security.oauth2.provider.token.ResourceServerTokenServices;
import org.springframework.util.StringUtils;

import java.util.*;

import static java.util.stream.Collectors.toList;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Profile(Constants.PROFILE_OAUTH2)
@EnableOAuth2Sso
public class OAuth2SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static final Logger LOG = LoggerFactory.getLogger(OAuth2SecurityConfiguration.class);

    @Value("${spring.security.oauth2.client.provider.oidc.issuer-uri}")
    private String issuerUri;

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
            // Attention: We don't need/want security for registering at eureka
            .antMatchers("/eureka/**/*")
            // Attention: We don't need/want security for using config server
            .antMatchers("/config/**/*")
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
        // TODO: Should be 'STATELESS' if (angular) client is oidc/oauth2 aware
        // Currently, we 'store' the oidc/oauth2 stuff with http session
        .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
        .and()
            .authorizeRequests()
            .antMatchers("/services/**").authenticated()
            .antMatchers("/eureka/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/config/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/api/profile-info").permitAll()
            // rest endpoints are protected individually by @Secured (and should normally require ROLE_ADMIN)
            // .antMatchers("/api/**").authenticated()
            .antMatchers("/config/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/management/health").permitAll()
            .antMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN)
        .and()
            .oauth2Login()
        .and()
            .oauth2ResourceServer().jwt();
        // @formatter:on
    }

    @Bean
    public OAuth2RestTemplate oAuth2RestTemplate(OAuth2ProtectedResourceDetails resource) {
        return new OAuth2RestTemplate(resource);
    }

    @Bean
    public OAuth2AuthenticationManager oAuth2AuthenticationManager(ResourceServerTokenServices tokenServices) {
        OAuth2AuthenticationManager result = new OAuth2AuthenticationManager();
        result.setTokenServices(tokenServices);
        return result;
    }

    @Bean
    public AuthoritiesExtractor authoritiesExtractor() {
        return new AuthoritiesExtractor() {

            @Override
            public List<GrantedAuthority> extractAuthorities(Map<String, Object> map) {
                Set<GrantedAuthority> result = new HashSet<>();
                extract(result, "roles", map);
                extract(result, "roles2", map);
                extract(result, "groups", map);

                return new ArrayList<>(result);
            }

            private void extract(Set<GrantedAuthority> result, String key, Map<String, Object> map) {
                Object value = map.get(key);
                if (value instanceof Collection) {
                    Collection<String> list = (Collection<String>) value;
                    list.stream()
                        .filter(s -> !StringUtils.isEmpty(s))
                        .map(s -> new SimpleGrantedAuthority(s.trim()))
                        .forEach(result::add);
                } else if (value instanceof String) {
                    result.add(new SimpleGrantedAuthority((String) ((String) value).trim()));
                } else {
                    LOG.warn("Could not map value: " + value);
                }
            }
        };
    }

    // stackoverflown: Handle UserRedirectRequiredException
    @Bean
    public FilterRegistrationBean<OAuth2ClientContextFilter> oauth2FilterRegistration(OAuth2ClientContextFilter filter) {
        FilterRegistrationBean<OAuth2ClientContextFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(filter);
        registrationBean.setOrder(-100);
        return registrationBean;
    }

    @Bean
    @SuppressWarnings("unchecked")
    public GrantedAuthoritiesMapper userAuthoritiesMapper() {
        return (authorities) -> {
            Set<GrantedAuthority> mappedAuthorities = new HashSet<>();

            authorities.forEach(authority -> {
                OidcUserAuthority oidcUserAuthority = (OidcUserAuthority) authority;
                OidcUserInfo userInfo = oidcUserAuthority.getUserInfo();
                if (userInfo == null) {
                    // Setting a 'random' group is a security risk.
                    // mappedAuthorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
                } else {
                    Collection<String> groups = (Collection<String>) userInfo.getClaims().get("groups");
                    if (groups == null) {
                        groups = (Collection<String>) userInfo.getClaims().get("roles");
                    }
                    mappedAuthorities.addAll(groups.stream()
                        .filter(group -> group.startsWith("ROLE_"))
                        .map(SimpleGrantedAuthority::new).collect(toList()));
                }
            });

            return mappedAuthorities;
        };
    }

    @Bean
    JwtDecoder jwtDecoder() {
        NimbusJwtDecoderJwkSupport jwtDecoder = (NimbusJwtDecoderJwkSupport)
            JwtDecoders.fromOidcIssuerLocation(issuerUri);

        OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator();
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuerUri);
        OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator);

        jwtDecoder.setJwtValidator(withAudience);

        return jwtDecoder;
    }
}
