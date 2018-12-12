package io.github.jhipster.registry.config;

public class Constants {

    /*
      Security.
     */
    public static final String PROFILE_OAUTH2 = "oauth2";
    public static final String PROFILE_UAA = "uaa";

    /*
      Discovery.
     */
    public static final String PROFILE_EUREKA = "eureka";
    public static final String PROFILE_CONSULDISCOVERY = "consuldiscovery";
    public static final String PROFILE_KUBERNTETES = "kubernetes";


    /*
      Config.
     */
    public static final String CONFIGSERVER = "configserver";
    public static final String CONSULCONFIG = "consulconfig";

    /*
        Internal proxy.
     */
    public static final String PROXY = "proxy";

    private Constants() {
    }
}
