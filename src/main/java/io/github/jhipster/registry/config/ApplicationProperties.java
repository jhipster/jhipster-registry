package io.github.jhipster.registry.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to JHipster.
 *
 * Properties are configured in the {@code application.yml} file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private final Oauth2 oauth2 = new Oauth2();

    public Oauth2 getOauth2() {
        return oauth2;
    }

    public static class Oauth2 {

        private String principalAttribute;

        private String authoritiesAttribute;

        public String getPrincipalAttribute() {
            return principalAttribute;
        }

        public void setPrincipalAttribute(String principalAttribute) {
            this.principalAttribute = principalAttribute;
        }

        public String getAuthoritiesAttribute() {
            return authoritiesAttribute;
        }

        public void setAuthoritiesAttribute(String authoritiesAttribute) {
            this.authoritiesAttribute = authoritiesAttribute;
        }
    }
}
