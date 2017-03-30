package io.github.jhipster.registry.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.netflix.appinfo.InstanceInfo;
import io.github.jhipster.registry.service.routeWrapper.RegistryRoute;
import io.github.jhipster.registry.web.rest.vm.RouteVM;
import org.springframework.beans.factory.annotation.Value;
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

    private  ZuulProperties zuulProperties;

    public RoutesResource(RouteLocator routeLocator, ZuulProperties zuulProperties) {
        this.routeLocator = routeLocator;
        this.zuulProperties = zuulProperties;
    }

    @GetMapping("/routes")
    @Timed
    public ResponseEntity<List<RouteVM>> getRoutes() {

        List<Route> routes = routeLocator.getRoutes();
        Map<String, RouteVM> routeVMs = new HashMap<>();
        routeVMs.put(null, registryRoute());

        routes.forEach(route -> {
            RouteVM routeVM = new RouteVM();
            routeVM.setPath(route.getFullPath());
            routeVM.setPrefix(route.getPrefix());
            routeVM.setServiceId(route.getId());
            routeVM.setAppName(extractName(route.getId()));
            routeVMs.put(route.getId(), routeVM);
        });

        fillStatus(routeVMs);

        return new ResponseEntity<>(new ArrayList<>(routeVMs.values()), HttpStatus.OK);
    }

    /**
     * Fill all Routes with each instance status.
     */
    private void fillStatus(Map<String, RouteVM> routeVMs) {
        if(routeVMs != null && !routeVMs.isEmpty()) {
            zuulProperties.getRoutes().values().forEach(oneRoute -> {
                if(oneRoute instanceof RegistryRoute){
                    routeVMs.get(oneRoute.getId()).setStatus(((RegistryRoute) oneRoute).getStatus());
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
        if(id!=null && id.contains(":")){
            return id.substring(0, id.indexOf(":"));
        }
        return id;
    }

}
