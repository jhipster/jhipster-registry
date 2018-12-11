package io.github.jhipster.registry.config.apidoc;

import io.github.jhipster.config.JHipsterConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.netflix.zuul.filters.Route;
import org.springframework.cloud.netflix.zuul.filters.RouteLocator;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import springfox.documentation.swagger.web.SwaggerResource;
import springfox.documentation.swagger.web.SwaggerResourcesProvider;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;

/**
 * Retrieves all registered microservices Swagger resources.
 */
@Component
@Primary
@Profile(JHipsterConstants.SPRING_PROFILE_SWAGGER)
public class RegistrySwaggerResourcesProvider implements SwaggerResourcesProvider {

    private final Logger log = LoggerFactory.getLogger(RegistrySwaggerResourcesProvider.class);

    private final RouteLocator routeLocator;

    private final DiscoveryClient discoveryClient;

    public RegistrySwaggerResourcesProvider(Optional<RouteLocator> routeLocator, DiscoveryClient discoveryClient) {
        this.routeLocator = routeLocator.orElse(null);
        this.discoveryClient = discoveryClient;
    }

    @Override
    public List<SwaggerResource> get() {
        List<SwaggerResource> resources = new ArrayList<>();

        //Add the registry swagger resource that correspond to the jhipster-registry's own swagger doc
        resources.add(swaggerResource("jhipster-registry", "/v2/api-docs"));

        //Add the registered microservices swagger docs as additional swagger resources
        List<Route> routes = ofNullable(routeLocator)
            .map(RouteLocator::getRoutes)
            .orElse(Collections.emptyList())
            .stream()
            .filter(route -> !"consul".equals(route.getId()))
            .collect(Collectors.toList());

        routes.forEach(route -> {
            resources.add(swaggerResource(route.getId(), route.getFullPath().replace("**", "v2/api-docs")));
        });

        return resources;
    }

    private SwaggerResource swaggerResource(String name, String location) {
        SwaggerResource swaggerResource = new SwaggerResource();
        swaggerResource.setName(name);
        swaggerResource.setLocation(location);
        swaggerResource.setSwaggerVersion("2.0");
        return swaggerResource;
    }
}
