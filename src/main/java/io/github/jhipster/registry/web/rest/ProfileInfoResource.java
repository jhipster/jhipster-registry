package io.github.jhipster.registry.web.rest;

import io.github.jhipster.registry.config.JHipsterProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Resource to return information about the currently running Spring profiles.
 */
@RestController
@RequestMapping("/api")
public class ProfileInfoResource {

    @Inject
    Environment env;

    @Inject
    private JHipsterProperties jHipsterProperties;

    @Value("${spring.cloud.config.server.native.search-locations:}")
    private String nativeSearchLocation;

    @Value("${spring.cloud.config.server.git.uri:}")
    private String gitUri;

    @Value("${spring.cloud.config.server.git.search-paths:}")
    private String gitSearchLocation;

    @GetMapping("/profile-info")
    public ProfileInfoResponse getActiveProfiles() {
        return new ProfileInfoResponse(env.getActiveProfiles(), getRibbonEnv(), nativeSearchLocation, gitUri, gitSearchLocation);
    }

    private String getRibbonEnv() {
        String[] activeProfiles = env.getActiveProfiles();
        String[] displayOnActiveProfiles = jHipsterProperties.getRibbon().getDisplayOnActiveProfiles();

        if (displayOnActiveProfiles == null) {
            return null;
        }

        List<String> ribbonProfiles = new ArrayList<>(Arrays.asList(displayOnActiveProfiles));
        List<String> springBootProfiles = Arrays.asList(activeProfiles);
        ribbonProfiles.retainAll(springBootProfiles);

        if (ribbonProfiles.size() > 0) {
            return ribbonProfiles.get(0);
        }
        return null;
    }

    private class ProfileInfoResponse {
        public String[] activeProfiles;
        public String ribbonEnv;
        public String nativeSearchLocation;
        public String gitUri;
        public String gitSearchLocation;

        ProfileInfoResponse(String[] activeProfiles, String ribbonEnv, String nativeSearchLocation, String gitUri,
                            String gitSearchLocation) {
            this.activeProfiles = activeProfiles;
            this.ribbonEnv = ribbonEnv;
            this.nativeSearchLocation = nativeSearchLocation;
            this.gitUri = gitUri;
            this.gitSearchLocation = gitSearchLocation;
        }
    }
}
