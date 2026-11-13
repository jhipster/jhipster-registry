package tech.jhipster.registry.config;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.registry.security.*;
import tech.jhipster.registry.web.filter.SpaWebFilter;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
@Profile("!" + Constants.PROFILE_OAUTH2)
public class SecurityConfiguration {

    private final JHipsterProperties jHipsterProperties;

    public SecurityConfiguration(JHipsterProperties jHipsterProperties) {
        this.jHipsterProperties = jHipsterProperties;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http
            .cors(withDefaults())
            .csrf(csrf -> csrf.disable())
            .addFilterAfter(new SpaWebFilter(), BasicAuthenticationFilter.class)
            .headers(headers ->
                headers
                    .contentSecurityPolicy(csp -> csp.policyDirectives(jHipsterProperties.getSecurity().getContentSecurityPolicy()))
                    .frameOptions(FrameOptionsConfig::sameOrigin)
                    .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                    .permissionsPolicyHeader(permissions ->
                        permissions.policy(
                            "camera=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), sync-xhr=()"
                        )
                    )
            )
            .authorizeHttpRequests(authz ->
                // prettier-ignore
                authz
                    .requestMatchers("/index.html", "/*.js", "/*.txt", "/*.json", "/*.map", "/*.css").permitAll()
                    .requestMatchers("/*.ico", "/*.png", "/*.svg", "/*.webapp").permitAll()
                    .requestMatchers("/content/**").permitAll()
                    .requestMatchers("/resources/**").permitAll()
                    .requestMatchers("/swagger-ui/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/authenticate").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/authenticate").permitAll()
                    .requestMatchers("/eureka/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .requestMatchers("/config/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .requestMatchers("/api/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .requestMatchers("/v3/api-docs/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .requestMatchers("/management/health").permitAll()
                    .requestMatchers("/management/health/**").permitAll()
                    .requestMatchers("/management/info").permitAll()
                    .requestMatchers("/management/prometheus").permitAll()
                    .requestMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN)
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions ->
                exceptions
                    .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
                    .accessDeniedHandler(new BearerTokenAccessDeniedHandler())
            )
            // Applications register with Eureka and read their configuration using HTTP Basic
            .httpBasic(basic -> basic.realmName("JHipster Registry"))
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults()));
        return http.build();
    }
}
