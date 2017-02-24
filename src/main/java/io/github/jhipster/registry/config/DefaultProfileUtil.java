package io.github.jhipster.registry.config;

import io.github.jhipster.config.JHipsterConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.boot.SpringApplication;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * Utility class to load a Spring profile to be used as default
 * when there is no <code>spring.profiles.active</code> set in the environment or as command line argument.
 * If the value is not available in <code>application.yml</code> then <code>dev</code> profile will be used as default.
 */
public final class DefaultProfileUtil {

    private final static Logger log = LoggerFactory.getLogger(WebConfigurer.class);

    private static final String SPRING_PROFILE_DEFAULT = "spring.profiles.default";
    private static final String SPRING_PROFILE_ACTIVE = "spring.profiles.active";

    private static final Properties BUILD_PROPERTIES = readProperties();

    private DefaultProfileUtil() {
    }

    /**
     * Get a default profile from <code>application.yml</code>.
     */
    public static String getDefaultActiveProfiles(){
        if (BUILD_PROPERTIES != null) {
            String activeProfile = BUILD_PROPERTIES.getProperty(SPRING_PROFILE_ACTIVE);
            if (activeProfile != null && !activeProfile.isEmpty() &&
                (activeProfile.contains(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT) ||
                    activeProfile.contains(JHipsterConstants.SPRING_PROFILE_PRODUCTION))) {
                return activeProfile;
            }
        }
        log.warn("No Spring profile configured, running with default profile: {}", JHipsterConstants.SPRING_PROFILE_DEVELOPMENT);
        return JHipsterConstants.SPRING_PROFILE_DEVELOPMENT;
    }


    /**
     * Set a default to use when no profile is configured.
     *
     * @param app the Spring application
     */
    public static void addDefaultProfile(SpringApplication app) {
        Map<String, Object> defProperties =  new HashMap<>();
        /*
        * The default profile to use when no other profiles are defined
        * This cannot be set in the <code>application.yml</code> file.
        * See https://github.com/spring-projects/spring-boot/issues/1219
        */
        defProperties.put(SPRING_PROFILE_DEFAULT, JHipsterConstants.SPRING_PROFILE_DEVELOPMENT);
        app.setDefaultProperties(defProperties);
    }

    /**
     * Get the profiles that are applied else get default profiles.
     */
    public static String[] getActiveProfiles(Environment env) {
        String[] profiles = env.getActiveProfiles();
        if (profiles.length == 0) {
            return env.getDefaultProfiles();
        }
        return profiles;
    }

    /**
     * Load application.yml from classpath.
     */
    private static Properties readProperties() {
        try {
            YamlPropertiesFactoryBean factory = new YamlPropertiesFactoryBean();
            factory.setResources(new ClassPathResource("config/application.yml"));
            return factory.getObject();
        } catch (Exception e) {
            log.error("Failed to read application.yml to get default profile");
            return null;
        }
    }
}
