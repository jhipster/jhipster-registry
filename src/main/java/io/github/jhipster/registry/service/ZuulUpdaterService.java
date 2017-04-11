package io.github.jhipster.registry.service;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.netflix.zuul.RoutesRefreshedEvent;
import org.springframework.cloud.netflix.zuul.filters.RouteLocator;
import org.springframework.cloud.netflix.zuul.filters.ZuulProperties;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.shared.Application;
import com.netflix.eureka.EurekaServerContextHolder;

/**
 * Updates Zuul proxies depending on available application instances.
 *
 * This uses directly the Eureka server, so it only works with the Eureka option.
 */
@Service
public class ZuulUpdaterService {

    private final Logger log = LoggerFactory.getLogger(ZuulUpdaterService.class);

    private final RouteLocator routeLocator;

    private final ZuulProperties zuulProperties;

    private final ApplicationEventPublisher publisher;

    public ZuulUpdaterService(RouteLocator routeLocator, ZuulProperties zuulProperties, ApplicationEventPublisher
        publisher) {
        this.routeLocator = routeLocator;
        this.zuulProperties = zuulProperties;
        this.publisher = publisher;
    }

    @Scheduled(fixedDelay = 5_000)
    public void updateZuulRoutes() {
        log.debug("Update Zuul routes to application instances");

        boolean isDirty = false;

        List<Application> applications = EurekaServerContextHolder
            .getInstance()
            .getServerContext()
            .getRegistry()
            .getApplications()
            .getRegisteredApplications();

        for (Application application : applications) {

            for (InstanceInfo instanceInfos : application.getInstances()) {
                String instanceId = instanceInfos.getId();
                String url = instanceInfos.getHomePageUrl();
                log.debug("Checking instance {} - {} ", instanceId, url);

                ZuulProperties.ZuulRoute zuulRoute =
                    new ZuulProperties.ZuulRoute(
                        "/services/" + application.getName().toLowerCase() + "/" +
                            instanceId + "/**",
                        url);

                if (zuulProperties.getRoutes().containsKey(instanceId)) {
                    log.debug("Instance '{}' already registered", instanceId);
                    if (!zuulProperties.getRoutes().get(instanceId).getUrl()
                        .equals(url)) {

                        log.debug("Updating instance '{}' with new URL: {}", instanceId, url);
                        zuulProperties.getRoutes().put(instanceId, zuulRoute);
                        isDirty = true;
                    }
                } else {
                    log.debug("Adding instance '{}' with URL: {}", instanceId, url);
                    zuulProperties.getRoutes().put(instanceId, zuulRoute);
                    isDirty = true;
                }
            }
        }
        List<String> zuulRoutesToRemove = new ArrayList<>();
        for (String key : zuulProperties.getRoutes().keySet()) {
            if (applications
                .stream()
                .flatMap(application -> application.getInstances().stream())
                .filter(instanceInfo ->
                    instanceInfo.getId().equals(key)
                )
                .count() == 0) {

                log.debug("Removing instance '{}'", key);
                zuulRoutesToRemove.add(key);
                isDirty = true;
            }
        }
        for (String key : zuulRoutesToRemove) {
            zuulProperties.getRoutes().remove(key);
        }
        if (isDirty) {
            log.info("Zuul routes have changed - refreshing the configuration");
            this.publisher.publishEvent(new RoutesRefreshedEvent(routeLocator));
        }
    }
}
