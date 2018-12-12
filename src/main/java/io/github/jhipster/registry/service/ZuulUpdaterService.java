package io.github.jhipster.registry.service;

import io.github.jhipster.registry.service.dto.ZuulRouteDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.netflix.eureka.EurekaDiscoveryClient;
import org.springframework.cloud.netflix.zuul.RoutesRefreshedEvent;
import org.springframework.cloud.netflix.zuul.filters.RouteLocator;
import org.springframework.cloud.netflix.zuul.filters.ZuulProperties;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static io.github.jhipster.config.JHipsterDefaults.Cache.Hazelcast.ManagementCenter.url;
import static io.github.jhipster.registry.config.Constants.PROFILE_CONSULDISCOVERY;
import static io.github.jhipster.registry.config.Constants.PROFILE_EUREKA;

/**
 * Updates Zuul proxies depending on available application instances.
 *
 * This uses directly the Eureka server, so it only works with the Eureka option.
 */
@Profile("proxy")
@Service
public class ZuulUpdaterService {

    private final Logger log = LoggerFactory.getLogger(ZuulUpdaterService.class);

    private final RouteLocator routeLocator;

    private final ZuulProperties zuulProperties;

    private final ApplicationEventPublisher publisher;

    private final Environment environment;

    private final DiscoveryClient discoveryClient;

    public ZuulUpdaterService(RouteLocator routeLocator, ZuulProperties zuulProperties,
                              ApplicationEventPublisher publisher, Environment environment,
                              DiscoveryClient discoveryClient) {
        this.routeLocator = routeLocator;
        this.zuulProperties = zuulProperties;
        this.publisher = publisher;
        this.environment = environment;
        this.discoveryClient = discoveryClient;
    }

    @Scheduled(fixedDelayString = "${jhipster-registry.proxy.zuul-updater-frequency-ms:5000}")
    public void updateZuulRoutes() {
        boolean isDirty = false;
        List<String> services = discoveryClient.getServices();
        ArrayList<ServiceInstance> allInstances = new ArrayList<>();
        for (String service : services) {
            List<ServiceInstance> serviceInstances = discoveryClient.getInstances(service)
                .stream()
                .filter(serviceInstance -> this.getInstanceIdFromInstance(serviceInstance) != null)
                .collect(Collectors.toList());

            for (ServiceInstance instance : serviceInstances) {
                allInstances.add(instance);
                String serviceName = service.toLowerCase();
                String instanceId = getInstanceIdFromInstance(instance);
                if (instanceId != null) {
                    String uri = instance.getUri().toString();
                    log.debug("Checking instance {} - {} ", serviceName, uri);
                    ZuulRouteDTO route = new ZuulRouteDTO(instanceId, "/" +
                        serviceName + "/" + instanceId + "/**",
                        null, uri, zuulProperties.isStripPrefix(), zuulProperties.getRetryable(), null,
                        "UP");

                    if (zuulProperties.getRoutes().containsKey(instanceId)) {
                        log.debug("Instance '{}' already registered", instanceId);
                        if (!zuulProperties.getRoutes().get(instanceId).getUrl().equals(uri)) {
                            log.debug("Updating instance '{}' with new URL: {}", instanceId, uri);
                            zuulProperties.getRoutes().put(instanceId, route);
                            isDirty = true;
                        }
                    } else {
                        log.debug("Adding instance '{}' with URL: {}", instanceId, url);
                        zuulProperties.getRoutes().put(instanceId, route);
                        isDirty = true;
                        }
                }
            }
        }

        List<String> zuulRoutesToRemove = new ArrayList<>();
        for (String route : zuulProperties.getRoutes().keySet()) {
            if(allInstances.stream().noneMatch(instance -> route.equals(getInstanceIdFromInstance(instance)))) {
                log.debug("Removing instance '{}'", route);
                zuulRoutesToRemove.add(route);
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

    private String getInstanceIdFromInstance(ServiceInstance instance) {
        if (isProfileActive(PROFILE_EUREKA)) {
            EurekaDiscoveryClient.EurekaServiceInstance eurekaInstance = (EurekaDiscoveryClient.EurekaServiceInstance) instance;
            return eurekaInstance.getInstanceInfo().getInstanceId();
        }
        if (isProfileActive(PROFILE_CONSULDISCOVERY)) {
            return instance.getMetadata().get("instanceId");
        }
        return instance.getServiceId();
    }

    private boolean isProfileActive(String profile) {
        return Arrays.asList(this.environment.getActiveProfiles()).contains(profile);
    }
}

