package tech.jhipster.registry.web.rest;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/** Local HTTP boundary for real provider clients; never binds beyond loopback. */
final class DiscoveryProviderFixture implements AutoCloseable {

    private final HttpServer server;

    private final String provider;

    private final List<String> requests = new CopyOnWriteArrayList<>();

    private volatile boolean empty;

    private volatile boolean denied;

    DiscoveryProviderFixture(String provider) throws IOException {
        this.provider = provider;
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/", this::respond);
        server.start();
    }

    int port() {
        return server.getAddress().getPort();
    }

    String url() {
        return "http://127.0.0.1:" + port();
    }

    List<String> requests() {
        return List.copyOf(requests);
    }

    void reset() {
        empty = false;
        denied = false;
    }

    void empty() {
        empty = true;
    }

    void deny() {
        denied = true;
    }

    private void respond(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        requests.add(exchange.getRequestMethod() + " " + exchange.getRequestURI());
        int status = 200;
        String body;
        if (!"GET".equals(exchange.getRequestMethod())) {
            status = 405;
            body = "{}";
        } else if (denied) {
            status = 403;
            body = "{\"kind\":\"Status\",\"apiVersion\":\"v1\",\"status\":\"Failure\",\"reason\":\"Forbidden\",\"code\":403}";
        } else if ("consul".equals(provider)) {
            switch (path) {
                case "/v1/catalog/services":
                    body = empty ? "{}" : "{\"orders\":[]}";
                    break;
                case "/v1/health/service/orders":
                    body = CONSUL_HEALTH;
                    break;
                case "/v1/status/leader":
                    body = "\"127.0.0.1:8300\"";
                    break;
                default:
                    status = 404;
                    body = "{}";
            }
        } else {
            switch (path) {
                case "/api/v1/namespaces/default/services":
                    body =
                        "{\"kind\":\"ServiceList\",\"apiVersion\":\"v1\",\"metadata\":{\"resourceVersion\":\"1\"},\"items\":" +
                        (empty ? "[]" : "[" + KUBERNETES_SERVICE + "]") +
                        "}";
                    break;
                case "/api/v1/namespaces/default/services/orders":
                    body = KUBERNETES_SERVICE;
                    break;
                case "/api/v1/namespaces/default/endpoints":
                    body = KUBERNETES_ENDPOINTS;
                    break;
                default:
                    status = 404;
                    body = "{\"kind\":\"Status\",\"apiVersion\":\"v1\",\"status\":\"Failure\",\"reason\":\"NotFound\",\"code\":404}";
            }
        }
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("X-Consul-Index", "1");
        exchange.sendResponseHeaders(status, bytes.length);
        try (var response = exchange.getResponseBody()) {
            response.write(bytes);
        }
    }

    @Override
    public void close() {
        server.stop(0);
    }

    private static final String CONSUL_HEALTH =
        """
        [{"Node":{"ID":"node-id","Node":"fixture-node","Address":"127.0.0.1"},
          "Service":{"ID":"consul-wire-id","Service":"orders","Address":"service.example","Port":8443,
                     "Tags":[],"Meta":{"secure":"true","config-name":"OrderService","context-path":"/shop","management.port":"9443"}},
          "Checks":[{"Node":"fixture-node","CheckID":"service:orders","Name":"orders health","Status":"passing","ServiceID":"consul-wire-id","ServiceName":"orders"}]}]
        """;

    private static final String KUBERNETES_SERVICE =
        """
        {"kind":"Service","apiVersion":"v1",
         "metadata":{"name":"orders","namespace":"default","uid":"service-id","resourceVersion":"1",
                     "labels":{"secured":"true"},
                     "annotations":{"config-name":"OrderService","context-path":"/shop","management.port":"9443"}},
         "spec":{"clusterIP":"10.96.0.1","ports":[{"name":"https","port":443,"targetPort":8443}],"selector":{"app":"orders"}}}
        """;

    private static final String KUBERNETES_ENDPOINTS =
        """
        {"kind":"EndpointsList","apiVersion":"v1","metadata":{"resourceVersion":"1"},"items":[
          {"kind":"Endpoints","apiVersion":"v1","metadata":{"name":"orders","namespace":"default","uid":"endpoints-id"},
           "subsets":[{"addresses":[{"ip":"10.0.0.4","targetRef":{"kind":"Pod","namespace":"default","name":"ready-pod","uid":"ready-pod-id"}}],
                        "notReadyAddresses":[{"ip":"10.0.0.5","targetRef":{"kind":"Pod","namespace":"default","name":"pending-pod","uid":"pending-pod-id"}}],
                        "ports":[{"name":"http","port":8080,"protocol":"TCP"},{"name":"https","port":8443,"protocol":"TCP"}]}]}]}
        """;
}
