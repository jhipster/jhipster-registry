package tech.jhipster.registry.web.rest;

import java.util.Locale;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.registry.config.ApplicationProperties;
import tech.jhipster.registry.discovery.ApplicationsProvider;
import tech.jhipster.registry.web.rest.vm.ApplicationsVM;

/**
 * Controller for viewing the applications registered in the discovery backend in use.
 */
@RestController
@RequestMapping("/api")
public class ApplicationsResource {

    private final ApplicationProperties applicationProperties;

    private final ApplicationsProvider applicationsProvider;

    public ApplicationsResource(ApplicationProperties applicationProperties, ApplicationsProvider applicationsProvider) {
        this.applicationProperties = applicationProperties;
        this.applicationsProvider = applicationsProvider;
    }

    /**
     * GET  /applications : get the applications registered in the discovery backend
     */
    @GetMapping("/applications")
    public ResponseEntity<ApplicationsVM> applications() {
        ApplicationsVM applicationsVM = new ApplicationsVM();
        applicationsVM.setBackend(applicationProperties.getDiscovery().getBackend().name().toLowerCase(Locale.ROOT));
        applicationsVM.setApplications(applicationsProvider.getApplications());
        return ResponseEntity.ok(applicationsVM);
    }
}
