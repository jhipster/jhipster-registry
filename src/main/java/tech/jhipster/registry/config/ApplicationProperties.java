package tech.jhipster.registry.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private final Oauth2 oauth2 = new Oauth2();

    private final Eureka eureka = new Eureka();

    private final Consul consul = new Consul();

    private final Kubernetes kubernetes = new Kubernetes();

    private final Discovery discovery = new Discovery();

    public Oauth2 getOauth2() {
        return oauth2;
    }

    public Eureka getEureka() {
        return eureka;
    }

    public Consul getConsul() {
        return consul;
    }

    public Kubernetes getKubernetes() {
        return kubernetes;
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

    public static class Consul {

        private String host = "localhost";

        private int port = 8500;

        public String getHost() {
            return host;
        }

        public void setHost(String host) {
            this.host = host;
        }

        public int getPort() {
            return port;
        }

        public void setPort(int port) {
            this.port = port;
        }
    }

    public static class Kubernetes {

        private String namespace = "default";

        public String getNamespace() {
            return namespace;
        }

        public void setNamespace(String namespace) {
            this.namespace = namespace;
        }
    }

    public static class Discovery {

        private String backend = "eureka";

        public String getBackend() {
            return backend;
        }

        public void setBackend(String backend) {
            this.backend = backend;
        }
    }
}
