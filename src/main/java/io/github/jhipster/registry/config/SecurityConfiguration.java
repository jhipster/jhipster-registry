package io.github.jhipster.registry.config;

import io.github.jhipster.registry.security.AuthoritiesConstants;
import io.github.jhipster.registry.security.Http401UnauthorizedEntryPoint;
import io.github.jhipster.registry.security.jwt.JWTConfigurer;
import io.github.jhipster.registry.security.jwt.TokenProvider;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final Http401UnauthorizedEntryPoint authenticationEntryPoint;

    private final TokenProvider tokenProvider;

    public SecurityConfiguration(Http401UnauthorizedEntryPoint authenticationEntryPoint,
                                 TokenProvider tokenProvider) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
            .antMatchers(HttpMethod.OPTIONS, "/**")
            .antMatchers("/app/**/*.{js,html}")
            .antMatchers("/bower_components/**")
            .antMatchers("/content/**")
            .antMatchers("/test/**")
            .antMatchers("/h2-console/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
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
            .antMatchers("/**").permitAll() // cannot reconnect without this line
            .antMatchers("/api/**").authenticated()
            .antMatchers("/api/authenticate").permitAll()
            .antMatchers("/eureka/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/config/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/management/health").permitAll()
            .antMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .anyRequest().authenticated() // always at the end
        .and()
            .apply(securityConfigurerAdapter());
    }

    private JWTConfigurer securityConfigurerAdapter() {
        return new JWTConfigurer(tokenProvider);
    }
}
