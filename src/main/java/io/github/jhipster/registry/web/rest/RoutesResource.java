package io.github.jhipster.registry.web.rest;

import com.netflix.appinfo.InstanceInfo;
import io.github.jhipster.registry.service.dto.ZuulRouteDTO;
import io.github.jhipster.registry.web.rest.vm.RouteVM;
import io.micrometer.core.annotation.Timed;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.netflix.zuul.filters.Route;
import org.springframework.cloud.netflix.zuul.filters.RouteLocator;
import org.springframework.cloud.netflix.zuul.filters.ZuulProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RoutesResource {

    @Value("${spring.application.name}")
    private String registryName;

    private final RouteLocator routeLocator;

    private final DiscoveryClient discoveryClient;

    private ZuulProperties zuulProperties;

    public RoutesResource(RouteLocator routeLocator, DiscoveryClient discoveryClient, ZuulProperties zuulProperties) {
        this.routeLocator = routeLocator;
        this.discoveryClient = discoveryClient;
        this.zuulProperties = zuulProperties;
    }

    @GetMapping("/routes")
    public ResponseEntity<List<RouteVM>> getRoutes() {

        List<Route> routes = routeLocator.getRoutes();
        Map<String, RouteVM> routeVMs = new HashMap<>();
        routeVMs.put(null, registryRoute());

        routes.stream()
            .map(route -> {
                RouteVM routeVM = new RouteVM();
                routeVM.setPath(route.getFullPath());
                routeVM.setPrefix(route.getPrefix());
                routeVM.setAppName(extractName(route.getId()));
                routeVM.setServiceId(route.getId());
                routeVM.setServiceInstances(discoveryClient.getInstances(route.getId()));

                return routeVM;
            })
            // we don't need the service sets. They come in as of eureka.fetch-registry=true, which is needed for requests against UAA
            .filter(routeVM -> routeVM.getServiceInstances() == null || routeVM.getServiceInstances().isEmpty())
            .forEach(route -> routeVMs.put(route.getServiceId(), route));

        fillStatus(routeVMs);

        return new ResponseEntity<>(new ArrayList<>(routeVMs.values()), HttpStatus.OK);
    }

    /**
     * Fill all Routes with each instance status.
     */
    private void fillStatus(Map<String, RouteVM> routeVMs) {
        if (routeVMs != null && !routeVMs.isEmpty()) {
            zuulProperties.getRoutes().values().forEach(oneRoute -> {
                if (oneRoute instanceof ZuulRouteDTO) {
                    routeVMs.get(oneRoute.getId()).setStatus(((ZuulRouteDTO) oneRoute).getStatus());
                }
            });
        }
    }

    /**
     * Return the registry routeVM
     */
    private RouteVM registryRoute() {
        return new RouteVM("/**", null, null, registryName, InstanceInfo.InstanceStatus.UP.toString(), null);
    }

    private String extractName(String id) {
        if (id != null && id.contains(":")) {
            return id.substring(0, id.indexOf(":"));
        }
        return id;
    }

}
