package io.github.jhipster.registry.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.netflix.appinfo.InstanceInfo;
import io.github.jhipster.registry.web.rest.vm.RouteVM;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.netflix.zuul.filters.Route;
import org.springframework.cloud.netflix.zuul.filters.RouteLocator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class RoutesResource {

    @Value("${spring.application.name}")
    private String registryName;

    private final RouteLocator routeLocator;

    public RoutesResource(RouteLocator routeLocator) {
        this.routeLocator = routeLocator;
    }

    @GetMapping("/routes")
    @Timed
    public ResponseEntity<List<RouteVM>> getRoutes() {
        List<Route> routes = routeLocator.getRoutes();
        List<RouteVM> routeVMs = new ArrayList<>();
        routeVMs.add(registryRoute());

        routes.forEach(route -> {
            RouteVM routeVM = new RouteVM();
            routeVM.setPath(route.getFullPath());
            routeVM.setPrefix(route.getPrefix());
            routeVM.setServiceId(route.getId());
            routeVM.setAppName(extractName(route.getId()));
            routeVMs.add(routeVM);
        });

        return new ResponseEntity<>(routeVMs, HttpStatus.OK);
    }

    /**
     * Return the registry routeVM
     */
    private RouteVM registryRoute() {
        return new RouteVM("/**", null, null, registryName, InstanceInfo.InstanceStatus.UP, null);
    }

    private String extractName(String id) {
        if(id!=null && id.contains(":")){
            return id.substring(0, id.indexOf(":"));
        }
        return id;
    }

}
