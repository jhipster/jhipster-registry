package io.github.jhipster.registry.web.rest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * REST Controller for viewing information about the currently running application.
 */
public class AppInfoResource {

    @Value("${eureka.instance.metadata-map.version}")
    private String appVersion;

    /**
     * GET  /info/version : get the version of the currently running application.
     * @return the application version
     */
    @GetMapping("/info/version")
    public String getVersion() {
        return appVersion;
    }

}
