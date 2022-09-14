package tech.jhipster.registry.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.zalando.problem.spring.web.advice.security.SecurityProblemSupport;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.registry.management.SecurityMetersService;
import tech.jhipster.registry.security.AuthoritiesConstants;
import tech.jhipster.registry.security.jwt.JWTConfigurer;
import tech.jhipster.registry.security.jwt.TokenProvider;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Import(SecurityProblemSupport.class)
@Profile("!" + Constants.PROFILE_OAUTH2)
public class JWTSecurityConfiguration {

    private final JHipsterProperties jHipsterProperties;

    private final SecurityProblemSupport problemSupport;

    private final SecurityMetersService securityMetersService;

    private final String username;

    private final String password;

    private final String[] roles;

    public JWTSecurityConfiguration(
        @Value("${spring.security.user.name}") String username,
        @Value("${spring.security.user.password}") String password,
        @Value("${spring.security.user.roles}") String[] roles,
        JHipsterProperties jHipsterProperties,
        SecurityProblemSupport securityProblemSupport,
        SecurityMetersService securityMetersService
    ) {
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.jHipsterProperties = jHipsterProperties;
        this.problemSupport = securityProblemSupport;
        this.securityMetersService = securityMetersService;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername(username).password(passwordEncoder().encode(password)).roles(roles).build());
        return manager;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web ->
            web
                .ignoring()
                .antMatchers(HttpMethod.OPTIONS, "/**")
                .antMatchers("/app/**/*.{js,html}")
                .antMatchers("/i18n/**")
                .antMatchers("/content/**")
                .antMatchers("/swagger-ui/**")
                .antMatchers("/test/**");
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
                .authenticationEntryPoint(problemSupport)
                .accessDeniedHandler(problemSupport)
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
                .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
                .authorizeRequests()
                .antMatchers("/eureka/**").hasAuthority(AuthoritiesConstants.ADMIN)
                .antMatchers("/config/**").hasAuthority(AuthoritiesConstants.ADMIN)
                .antMatchers("/api/authenticate").permitAll()
                .antMatchers("/api/**").hasAuthority(AuthoritiesConstants.ADMIN)
                .antMatchers("/management/info").permitAll()
                .antMatchers("/management/health").permitAll()
                .antMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN)
                .antMatchers("/v3/api-docs/**").permitAll()
                .antMatchers("/swagger-ui/index.html").hasAuthority(AuthoritiesConstants.ADMIN)
            .and()
                .httpBasic().realmName("JHipster Registry")
            .and()
                .apply(securityConfigurerAdapter());
        return http.build();
        // @formatter:on
    }

    private JWTConfigurer securityConfigurerAdapter() {
        return new JWTConfigurer(tokenProvider());
    }

    @Bean
    public TokenProvider tokenProvider() {
        return new TokenProvider(jHipsterProperties, securityMetersService);
    }
}
