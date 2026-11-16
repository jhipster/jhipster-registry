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

    /**
     * Discovery backend used by the Registry, see {@code application.discovery.backend}.
     */
    public static class Discovery {

        public static final String PROPERTY_PREFIX = "application.discovery";

        private Backend backend = Backend.EUREKA;

        public Backend getBackend() {
            return backend;
        }

        public void setBackend(Backend backend) {
            this.backend = backend;
        }

        /**
         * Discovery backends supported by the Registry. The consul and kubernetes profiles of the Registry select
         * their own backend.
         */
        public enum Backend {
            /**
             * Embedded Eureka server, the default backend of the Registry.
             */
            EUREKA,
            /**
             * HashiCorp Consul, through the Spring Cloud Consul discovery client.
             */
            CONSUL,
            /**
             * Kubernetes, through the Spring Cloud Kubernetes discovery client.
             */
            KUBERNETES,
        }
    }
}
