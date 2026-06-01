package tech.jhipster.registry.service.discovery;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Service;
import io.kubernetes.client.openapi.models.V1ServiceList;
import io.kubernetes.client.openapi.models.V1Endpoints;
import io.kubernetes.client.openapi.models.V1EndpointsList;
import io.kubernetes.client.util.ClientBuilder;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import tech.jhipster.registry.config.ApplicationProperties;

@Service
@ConditionalOnProperty(name = "application.discovery.backend", havingValue = "kubernetes")
public class KubernetesDiscoveryService implements DiscoveryService {

    private final Logger log = LoggerFactory.getLogger(KubernetesDiscoveryService.class);

    private final ApplicationProperties applicationProperties;

    private final CoreV1Api api;

    public KubernetesDiscoveryService(ApplicationProperties applicationProperties) throws IOException {
        this.applicationProperties = applicationProperties;
        ApiClient client = ClientBuilder.cluster().build();
        Configuration.setDefaultApiClient(client);
        this.api = new CoreV1Api();
        log.info("Kubernetes discovery service initialized in namespace: {}", applicationProperties.getKubernetes().getNamespace());
    }

    @Override
    public String getBackendType() {
        return "kubernetes";
    }

    @Override
    public List<Map<String, Object>> getApplications() {
        List<Map<String, Object>> apps = new ArrayList<>();
        String namespace = applicationProperties.getKubernetes().getNamespace();
        try {
            V1ServiceList services = api.listNamespacedService(namespace, null, null, null, null, null, null, null, null, null, null);
            for (V1Service svc : services.getItems()) {
                Map<String, Object> appData = new LinkedHashMap<>();
                appData.put("name", svc.getMetadata().getName());
                List<Map<String, Object>> instances = new ArrayList<>();
                try {
                    V1EndpointsList endpoints = api.listNamespacedEndpoints(
                        namespace,
                        null, null, null, null,
                        "metadata.name=" + svc.getMetadata().getName(),
                        null, null, null, null, null
                    );
                    for (V1Endpoints ep : endpoints.getItems()) {
                        if (ep.getSubsets() != null) {
                            for (var subset : ep.getSubsets()) {
                                if (subset.getAddresses() != null) {
                                    for (var addr : subset.getAddresses()) {
                                        Map<String, Object> instance = new HashMap<>();
                                        instance.put("instanceId", addr.getIp());
                                        instance.put("status", "UP");
                                        instance.put("homePageUrl", buildHomePageUrl(addr.getIp(), svc));
                                        instances.add(instance);
                                    }
                                }
                            }
                        }
                    }
                } catch (ApiException e) {
                    log.warn("Failed to fetch endpoints for service {}: {}", svc.getMetadata().getName(), e.getMessage());
                }
                appData.put("instances", instances);
                apps.add(appData);
            }
        } catch (ApiException e) {
            log.error("Failed to fetch Kubernetes services: {}", e.getMessage());
        }
        return apps;
    }

    @Override
    public Map<String, Object> getStatus() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("backend", "kubernetes");
        stats.put("namespace", applicationProperties.getKubernetes().getNamespace());
        return stats;
    }

    @Override
    public List<String> getReplicas() {
        return new ArrayList<>();
    }

    @Override
    public Map<String, Map<Long, String>> getLastN() {
        return new HashMap<>();
    }

    private String buildHomePageUrl(String ip, V1Service svc) {
        if (svc.getSpec() != null && svc.getSpec().getPorts() != null && !svc.getSpec().getPorts().isEmpty()) {
            int port = svc.getSpec().getPorts().get(0).getPort();
            return "http://" + ip + ":" + port;
        }
        return "http://" + ip;
    }
}
