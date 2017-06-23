package io.github.jhipster.registry.web.rest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Created by diego on 22/06/17.
 */
public class AppInfoResource {

    @Value("${eureka.instance.metadata-map.version}")
    private String appVersion;


    @GetMapping("/info/version")
    public String getVersion() {
        return appVersion;
    }

}
