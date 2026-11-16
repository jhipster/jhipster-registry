package tech.jhipster.registry.discovery;

import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.shared.Application;
import com.netflix.eureka.EurekaServerContext;
import com.netflix.eureka.EurekaServerContextHolder;
import com.netflix.eureka.registry.PeerAwareInstanceRegistry;
import java.util.ArrayList;
import java.util.List;

/**
 * Provides the applications registered in the embedded Eureka server.
 */
public class EurekaApplicationsProvider implements ApplicationsProvider {

    @Override
    public List<RegistryApplication> getApplications() {
        List<RegistryApplication> applications = new ArrayList<>();
        for (Application application : getRegistry().getSortedApplications()) {
            RegistryApplication registryApplication = new RegistryApplication(application.getName());
            for (InstanceInfo instanceInfo : application.getInstances()) {
                registryApplication.getInstances().add(toRegistryInstance(instanceInfo));
            }
            applications.add(registryApplication);
        }
        return applications;
    }

    private RegistryInstance toRegistryInstance(InstanceInfo instanceInfo) {
        return new RegistryInstance(
            instanceInfo.getInstanceId(),
            instanceInfo.getHomePageUrl(),
            instanceInfo.getHealthCheckUrl(),
            instanceInfo.getStatusPageUrl(),
            instanceInfo.getStatus().name(),
            instanceInfo.getMetadata()
        );
    }

    private PeerAwareInstanceRegistry getRegistry() {
        return getServerContext().getRegistry();
    }

    private EurekaServerContext getServerContext() {
        return EurekaServerContextHolder.getInstance().getServerContext();
    }
}
