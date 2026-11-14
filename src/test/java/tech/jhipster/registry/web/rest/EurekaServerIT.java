package tech.jhipster.registry.web.rest;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import tech.jhipster.registry.JHipsterRegistryApp;

/**
 * Tests the Eureka server endpoints over HTTP, the way applications call them.
 */
@SpringBootTest(classes = JHipsterRegistryApp.class, webEnvironment = WebEnvironment.RANDOM_PORT)
class EurekaServerIT {

    private static final String BASIC_AUTH = "Basic " + Base64.getEncoder().encodeToString("test:test".getBytes(StandardCharsets.UTF_8));

    @LocalServerPort
    private int port;

    private final HttpClient client = HttpClient.newHttpClient();

    @Test
    void shouldRejectRequestsWithoutCredentials() throws Exception {
        HttpRequest request = HttpRequest.newBuilder(uri("/eureka/apps")).GET().build();

        assertThat(client.send(request, HttpResponse.BodyHandlers.discarding()).statusCode()).isEqualTo(401);
    }

    @Test
    void shouldListApplications() throws Exception {
        HttpRequest request = HttpRequest.newBuilder(uri("/eureka/apps")).header("Authorization", BASIC_AUTH).GET().build();

        assertThat(client.send(request, HttpResponse.BodyHandlers.discarding()).statusCode()).isEqualTo(200);
    }

    /**
     * An application renews its lease with a heartbeat. Eureka answers 404 when it does not know the instance,
     * for example after the registry restarted, and the application registers again only when it gets that 404.
     */
    @Test
    void shouldAnswerNotFoundToTheHeartbeatOfAnUnknownInstance() throws Exception {
        HttpRequest request = HttpRequest.newBuilder(uri("/eureka/apps/UNKNOWN/unknown:1"))
            .header("Authorization", BASIC_AUTH)
            .PUT(HttpRequest.BodyPublishers.noBody())
            .build();

        assertThat(client.send(request, HttpResponse.BodyHandlers.discarding()).statusCode()).isEqualTo(404);
    }

    private URI uri(String path) {
        return URI.create("http://localhost:" + port + path);
    }
}
