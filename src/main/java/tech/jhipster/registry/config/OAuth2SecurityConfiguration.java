package tech.jhipster.registry.config;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.util.StringUtils;
import org.zalando.problem.spring.web.advice.security.SecurityProblemSupport;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.registry.security.AuthoritiesConstants;
import tech.jhipster.registry.security.SecurityUtils;
import tech.jhipster.registry.security.oauth2.AudienceValidator;
import tech.jhipster.registry.security.oauth2.JwtGrantedAuthorityConverter;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Import(SecurityProblemSupport.class)
@Profile(Constants.PROFILE_OAUTH2)
public class OAuth2SecurityConfiguration {

    private final String issuerUri;

    private final JHipsterProperties jHipsterProperties;

    private final SecurityProblemSupport problemSupport;

    public OAuth2SecurityConfiguration(
        @Value("${spring.security.oauth2.client.provider.oidc.issuer-uri}") String issuerUri,
        JHipsterProperties jHipsterProperties,
        SecurityProblemSupport problemSupport
    ) {
        this.issuerUri = issuerUri;
        this.jHipsterProperties = jHipsterProperties;
        this.problemSupport = problemSupport;
    }

    @Bean
    public InMemoryUserDetailsManager inMemoryUserDetailsManager(
        SecurityProperties properties,
        ObjectProvider<PasswordEncoder> passwordEncoder
    ) {
        SecurityProperties.User user = properties.getUser();
        List<String> roles = user.getRoles();
        return new InMemoryUserDetailsManager(
            User
                .withUsername(user.getName())
                .password(getOrDeducePassword(user, passwordEncoder.getIfAvailable()))
                .roles(StringUtils.toStringArray(roles))
                .build()
        );
    }

    private String getOrDeducePassword(SecurityProperties.User user, PasswordEncoder encoder) {
        if (encoder != null) {
            return user.getPassword();
        }
        return "{noop}" + user.getPassword();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web ->
            web
                .ignoring()
                .antMatchers("/app/**/*.{js,html}")
                .antMatchers("/i18n/**")
                .antMatchers("/swagger-ui/**")
                .antMatchers("/content/**");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // @formatter:off
        http
            .cors()
            .and()
                .csrf()
                .disable()
                .exceptionHandling()
                    .accessDeniedHandler(problemSupport)
                    .authenticationEntryPoint(problemSupport)
            .and()
                .headers()
                    .contentSecurityPolicy(jHipsterProperties.getSecurity().getContentSecurityPolicy())
                .and()
                    .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                .and()
                    .permissionsPolicy().policy("camera=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), sync-xhr=()")
                .and()
                    .frameOptions().sameOrigin()
            .and()
                .httpBasic().realmName("JHipster Registry")
            .and()
                .authorizeRequests()
                .antMatchers("/eureka/**").hasAuthority(AuthoritiesConstants.ADMIN)
                .antMatchers("/config/**").hasAuthority(AuthoritiesConstants.ADMIN)
                .antMatchers("/api/account").authenticated()
                .antMatchers("/api/logout").authenticated()
                .antMatchers("/api/**").hasAuthority(AuthoritiesConstants.ADMIN)
                .antMatchers("/management/info").permitAll()
                .antMatchers("/management/health").permitAll()
                .antMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN)
                .antMatchers("/v3/api-docs/**").permitAll()
                .antMatchers("/swagger-ui/index.html").hasAuthority(AuthoritiesConstants.ADMIN)
            .and()
                .oauth2ResourceServer()
                    .jwt()
                    .jwtAuthenticationConverter(authenticationConverter())
                    .and()
                .and()
                    .oauth2Login();
        return http.build();
        // @formatter:on
    }

    Converter<Jwt, AbstractAuthenticationToken> authenticationConverter() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new JwtGrantedAuthorityConverter());
        return jwtAuthenticationConverter;
    }

    @Bean
    public GrantedAuthoritiesMapper userAuthoritiesMapper() {
        return authorities -> {
            Set<GrantedAuthority> mappedAuthorities = new HashSet<>();

            authorities.forEach(authority -> {
                // Check for OidcUserAuthority because Spring Security 5.2 returns
                // each scope as a GrantedAuthority, which we don't care about.
                if (authority instanceof OidcUserAuthority) {
                    OidcUserAuthority oidcUserAuthority = (OidcUserAuthority) authority;
                    mappedAuthorities.addAll(SecurityUtils.extractAuthorityFromClaims(oidcUserAuthority.getUserInfo().getClaims()));
                }
            });
            return mappedAuthorities;
        };
    }

    @Bean
    JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = JwtDecoders.fromOidcIssuerLocation(issuerUri);

        OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator(jHipsterProperties.getSecurity().getOauth2().getAudience());
        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(issuerUri);
        OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator);

        jwtDecoder.setJwtValidator(withAudience);

        return jwtDecoder;
    }
}
