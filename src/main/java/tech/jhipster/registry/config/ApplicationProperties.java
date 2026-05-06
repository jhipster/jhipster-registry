package tech.jhipster.registry.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to JHipster.
 *
 * Properties are configured in the {@code application.yml} file.
 * See {@link tech.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private final Oauth2 oauth2 = new Oauth2();

    private final Eureka eureka = new Eureka();

    private final Discovery discovery = new Discovery();

    public Oauth2 getOauth2() {
        return oauth2;
    }

    public Eureka getEureka() {
        return eureka;
    }

    public Discovery getDiscovery() {
        return discovery;
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

    public static class Eureka {

        private String datacenter;

        private String environment;

        public String getDatacenter() {
            return datacenter;
        }

        public void setDatacenter(String datacenter) {
            this.datacenter = datacenter;
        }

        public String getEnvironment() {
            return environment;
        }

        public void setEnvironment(String environment) {
            this.environment = environment;
        }
    }

    public static class Discovery {

        /**
         * Preferred discovery backend name (eureka, consul, kubernetes).
         * If not set, the first active backend will be used.
         */
        private String backend;

        public String getBackend() {
            return backend;
        }

        public void setBackend(String backend) {
            this.backend = backend;
        }
    }
}
