package tech.jhipster.registry.service.discovery;

import static java.util.stream.Collectors.toMap;

import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.shared.Application;
import com.netflix.discovery.shared.Pair;
import com.netflix.eureka.EurekaServerContext;
import com.netflix.eureka.registry.PeerAwareInstanceRegistry;
import com.netflix.eureka.registry.PeerAwareInstanceRegistryImpl;
import com.netflix.eureka.resources.StatusResource;
import com.netflix.eureka.util.StatusInfo;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Supplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tech.jhipster.registry.config.ApplicationProperties;

/** Existing Eureka behavior, loaded only when Eureka is selected. */
public class EurekaDiscoveryBackend implements RegistryDiscoveryBackend {

    private final Logger log = LoggerFactory.getLogger(EurekaDiscoveryBackend.class);

    private final ApplicationProperties properties;

    private final Supplier<EurekaServerContext> contextSupplier;

    private final Supplier<StatusInfo> statusSupplier;

    public EurekaDiscoveryBackend(
        ApplicationProperties properties,
        Supplier<EurekaServerContext> contextSupplier,
        Supplier<StatusInfo> statusSupplier
    ) {
        this.properties = Objects.requireNonNull(properties);
        this.contextSupplier = Objects.requireNonNull(contextSupplier);
        this.statusSupplier = Objects.requireNonNull(statusSupplier);
    }

    @Override
    public List<Map<String, Object>> getApplications() {
        List<Map<String, Object>> applications = new ArrayList<>();
        for (Application application : getRegistry().getSortedApplications()) {
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("name", application.getName());
            List<Map<String, Object>> instances = new ArrayList<>();
            for (InstanceInfo info : application.getInstances()) {
                Map<String, Object> instance = new LinkedHashMap<>();
                instance.put("instanceId", info.getInstanceId());
                instance.put("homePageUrl", info.getHomePageUrl());
                instance.put("healthCheckUrl", info.getHealthCheckUrl());
                instance.put("statusPageUrl", info.getStatusPageUrl());
                instance.put("status", info.getStatus().name());
                instance.put("metadata", info.getMetadata() == null ? Map.of() : info.getMetadata());
                instances.add(instance);
            }
            result.put("instances", instances);
            String configName = application.getName().toLowerCase(java.util.Locale.ROOT);
            if (!instances.isEmpty()) {
                String id = (String) instances.get(0).get("instanceId");
                if (id != null && id.indexOf(':') > 0) {
                    configName = id.substring(0, id.indexOf(':'));
                }
            }
            result.put("configName", configName);
            applications.add(result);
        }
        return applications;
    }

    @Override
    public Map<String, Object> getStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("backend", "eureka");
        status.put("time", new Date());
        status.put("currentTime", StatusResource.getCurrentTimeAsString());
        status.put("upTime", StatusInfo.getUpTime());
        status.put("environment", properties.getEureka().getEnvironment());
        status.put("datacenter", properties.getEureka().getDatacenter());
        status.put("isBelowRenewThreshold", getRegistry().isBelowRenewThresold() == 1);
        status.put("generalStats", Map.of());
        status.put("instanceInfo", Map.of("ipAddr", "", "status", "UNKNOWN"));
        try {
            StatusInfo info = statusSupplier.get();
            if (info != null && info.getGeneralStats() != null) {
                status.put("generalStats", info.getGeneralStats());
            }
            if (info != null && info.getInstanceInfo() != null) {
                InstanceInfo instanceInfo = info.getInstanceInfo();
                Map<String, String> instance = new HashMap<>();
                instance.put("ipAddr", instanceInfo.getIPAddr());
                instance.put("status", instanceInfo.getStatus().name());
                status.put("instanceInfo", instance);
            }
        } catch (RuntimeException ex) {
            log.warn("Eureka status information is unavailable");
        }
        return status;
    }

    @Override
    public List<String> getReplicas() {
        List<String> replicas = new ArrayList<>();
        getContext()
            .getPeerEurekaNodes()
            .getPeerNodesView()
            .forEach(node -> {
                try {
                    URI uri = new URI(node.getServiceUrl());
                    replicas.add(uri.getHost() + ":" + uri.getPort());
                } catch (URISyntaxException ex) {
                    log.warn("Could not parse peer Eureka node URL");
                }
            });
        return replicas;
    }

    @Override
    public Map<String, Map<Long, String>> getLastN() {
        PeerAwareInstanceRegistryImpl registry = (PeerAwareInstanceRegistryImpl) getRegistry();
        Map<String, Map<Long, String>> lastN = new LinkedHashMap<>();
        lastN.put("canceled", registry.getLastNCanceledInstances().stream().collect(toMap(Pair::first, Pair::second)));
        lastN.put("registered", registry.getLastNRegisteredInstances().stream().collect(toMap(Pair::first, Pair::second)));
        return lastN;
    }

    private PeerAwareInstanceRegistry getRegistry() {
        return getContext().getRegistry();
    }

    private EurekaServerContext getContext() {
        EurekaServerContext context = contextSupplier.get();
        if (context == null) {
            throw new IllegalStateException("Eureka server is not ready");
        }
        return context;
    }
}
