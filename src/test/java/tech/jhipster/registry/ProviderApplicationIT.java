package tech.jhipster.registry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.netflix.eureka.EurekaServerContext;
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/** Start the real application with the selected optional starter and a loopback discovery API fixture. */
@EnabledIfSystemProperty(named = "discovery.test.provider", matches = "consul|kubernetes|eureka")
class ProviderApplicationIT {

    @Test
    void startsWithActualDiscoveryClientAndServesAllUiEndpoints() throws Exception {
        // Run explicitly in a separate test JVM: closing Eureka shuts down Servo's process-wide scheduler.
        String provider = System.getProperty("discovery.test.provider");
        List<String> requests = Collections.synchronizedList(new ArrayList<>());
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext(
            "/",
            exchange -> {
                String path = exchange.getRequestURI().getPath();
                requests.add(exchange.getRequestMethod() + " " + path);
                String body = fixture(path);
                byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().add("Content-Type", "application/json");
                exchange.sendResponseHeaders(body.isEmpty() ? 404 : 200, bytes.length);
                exchange.getResponseBody().write(bytes);
                exchange.close();
            }
        );
        server.start();
        int port = server.getAddress().getPort();
        List<String> arguments = new ArrayList<>(
            List.of(
                "--server.port=0",
                "--spring.profiles.active=native," + provider,
                "--spring.cloud.config.enabled=false",
                "--spring.cloud.bootstrap.location=file:./target/classes/config/bootstrap.yml",
                "--spring.cloud.config.server.bootstrap=false",
                "--eureka.client.fetch-registry=false",
                "--eureka.client.register-with-eureka=false",
                "--eureka.server.wait-time-in-ms-when-sync-empty=0",
                "--spring.cloud.consul.host=127.0.0.1",
                "--spring.cloud.consul.port=" + port,
                "--spring.cloud.consul.discovery.catalog-services-watch.enabled=false",
                "--spring.cloud.kubernetes.client.master-url=http://127.0.0.1:" + port,
                "--spring.cloud.kubernetes.client.namespace=default",
                "--spring.cloud.kubernetes.client.try-kube-config=false",
                "--spring.cloud.kubernetes.client.try-service-account=false",
                "--spring.cloud.kubernetes.discovery.catalog-services-watch.enabled=false",
                "--spring.cloud.kubernetes.config.enabled=false",
                "--spring.cloud.kubernetes.secrets.enabled=false"
            )
        );
        try (
            ConfigurableApplicationContext context = new SpringApplicationBuilder(JHipsterRegistryApp.class)
                .run(arguments.toArray(new String[0]))
        ) {
            MockMvc mvc = MockMvcBuilders.webAppContextSetup((WebApplicationContext) context).apply(springSecurity()).build();
            if (provider.equals("eureka")) {
                assertThat(context.getBeansOfType(EurekaServerContext.class)).hasSize(1);
                assertThat(context.containsBean("consulDiscoveryClient")).isFalse();
                assertThat(context.containsBean("kubernetesDiscoveryClient")).isFalse();
            } else {
                assertThat(context.getBeansOfType(EurekaServerContext.class)).isEmpty();
                assertThat(context.containsBean("eurekaClient")).isFalse();
                assertThat(context.getBean(provider + "DiscoveryClient").getClass().getSimpleName())
                    .isEqualTo(provider.equals("consul") ? "ConsulDiscoveryClient" : "KubernetesDiscoveryClient");
                mvc
                    .perform(get("/api/eureka/applications").accept(MediaType.APPLICATION_JSON).with(user("test").roles("ADMIN")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.applications[0].name").value("orders"))
                    .andExpect(jsonPath("$.applications[0].configName").value("orders"))
                    .andExpect(jsonPath("$.applications[0].instances[0].homePageUrl").value("http://127.0.0.1:8082/"))
                    .andExpect(jsonPath("$.applications[0].instances[0].status").value("UNKNOWN"));
                assertThat(requests)
                    .anyMatch(path -> path.contains(provider.equals("consul") ? "/v1/health/service/orders" : "/endpoints"));
            }
            for (String endpoint : List.of("applications", "status", "lastn", "replicas")) {
                mvc
                    .perform(get("/api/eureka/" + endpoint).accept(MediaType.APPLICATION_JSON).with(user("test").roles("ADMIN")))
                    .andExpect(status().isOk());
            }
            assertThat(requests).allMatch(request -> request.startsWith("GET "));
            System.out.println("Provider wiring verified: " + provider + "; real client requests: " + requests);
        } finally {
            server.stop(0);
        }
    }

    private static String fixture(String path) {
        if (path.equals("/v1/catalog/services")) {
            return "{\"orders\":[]}";
        }
        if (path.equals("/v1/health/service/orders")) {
            return "[{\"Node\":{\"Node\":\"fixture\",\"Address\":\"127.0.0.1\"},\"Service\":{\"ID\":\"orders:node:8082\",\"Service\":\"orders\",\"Address\":\"127.0.0.1\",\"Port\":8082,\"Meta\":{}},\"Checks\":[]}]";
        }
        if (path.equals("/v1/status/leader")) {
            return "\"127.0.0.1:8300\"";
        }
        String service =
            "{\"apiVersion\":\"v1\",\"kind\":\"Service\",\"metadata\":{\"name\":\"orders\",\"namespace\":\"default\",\"labels\":{}},\"spec\":{\"ports\":[{\"name\":\"http\",\"port\":8082,\"targetPort\":8082}]}}";
        if (path.equals("/api/v1/namespaces/default/services")) {
            return "{\"apiVersion\":\"v1\",\"kind\":\"ServiceList\",\"items\":[" + service + "]}";
        }
        if (path.equals("/api/v1/namespaces/default/services/orders")) {
            return service;
        }
        if (path.equals("/api/v1/namespaces/default/endpoints")) {
            return "{\"apiVersion\":\"v1\",\"kind\":\"EndpointsList\",\"items\":[{\"metadata\":{\"name\":\"orders\",\"namespace\":\"default\"},\"subsets\":[{\"addresses\":[{\"ip\":\"127.0.0.1\"}],\"ports\":[{\"name\":\"http\",\"port\":8082}]}]}]}";
        }
        return "";
    }
}
