package io.github.jhipster.registry.config;

import io.github.jhipster.config.JHipsterProperties;
import io.github.jhipster.registry.security.AuthoritiesConstants;
import io.github.jhipster.registry.security.Http401UnauthorizedEntryPoint;
import io.github.jhipster.registry.security.jwt.JWTConfigurer;
import io.github.jhipster.registry.security.jwt.TokenProvider;
import io.github.jhipster.registry.gateway.JWTTokenRelayFilter;
import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import javax.annotation.PostConstruct;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Profile("!" + Constants.PROFILE_OAUTH2)
public class JWTSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    private final Http401UnauthorizedEntryPoint authenticationEntryPoint;

    private final JHipsterProperties jHipsterProperties;

    private final String username;

    private final String password;

    private final String[] roles;

    public JWTSecurityConfiguration(@Value("${spring.security.user.name}") String username,
                                    @Value("${spring.security.user.password}") String password,
                                    @Value("${spring.security.user.roles}") String[] roles,
                                    AuthenticationManagerBuilder authenticationManagerBuilder,
                                    Http401UnauthorizedEntryPoint authenticationEntryPoint,
                                    JHipsterProperties jHipsterProperties) {
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.jHipsterProperties = jHipsterProperties;
    }

    @PostConstruct
    public void init() {
        try {
            authenticationManagerBuilder
                .userDetailsService(userDetailsService())
                .passwordEncoder(passwordEncoder());
        } catch (Exception e) {
            throw new BeanInitializationException("Security configuration failed", e);
        }
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(
            User.withUsername(username)
                .password(passwordEncoder().encode(password))
                .roles(roles)
                .build());
        return manager;
    }

    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
            .antMatchers("/app/**/*.{js,html}")
            .antMatchers("/swagger-ui/**")
            .antMatchers("/content/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors()
        .and()
            .exceptionHandling()
            .authenticationEntryPoint(authenticationEntryPoint)
        .and()
            .csrf()
            .disable()
            .headers()
            .frameOptions()
            .disable()
        .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
         .and()
            .httpBasic()
            .realmName("JHipster Registry")
        .and()
            .authorizeRequests()
            .antMatchers("/services/**").authenticated()
            .antMatchers("/eureka/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/config/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/api/authenticate").permitAll()
            .antMatchers("/api/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/management/info").permitAll()
            .antMatchers("/management/health").permitAll()
            .antMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/v2/api-docs/**").permitAll()
            .antMatchers("/swagger-resources/configuration/**").permitAll()
            .antMatchers("/swagger-ui/index.html").hasAuthority(AuthoritiesConstants.ADMIN)
        .and()
            .apply(securityConfigurerAdapter());
    }

    private JWTConfigurer securityConfigurerAdapter() {
        return new JWTConfigurer(tokenProvider());
    }

    @Bean
    public TokenProvider tokenProvider() {
        return new TokenProvider(jHipsterProperties);
    }

    @Bean
    public JWTTokenRelayFilter tokenRelayFilter() {
        return new JWTTokenRelayFilter();
    }
}
