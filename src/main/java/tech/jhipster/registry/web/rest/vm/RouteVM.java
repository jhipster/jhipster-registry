package tech.jhipster.registry.web.rest.vm;

import java.util.List;
import org.springframework.cloud.client.ServiceInstance;

/**
 * View Model that stores a route managed by the Registry.
 */
public class RouteVM {

    private String path;

    private String prefix;

    private String serviceId;

    private String appName;

    private String status;

    private List<ServiceInstance> serviceInstances;

    public RouteVM() {}

    public RouteVM(String path, String prefix, String serviceId, String appName, String status, List<ServiceInstance> serviceInstances) {
        this.path = path;
        this.prefix = prefix;
        this.serviceId = serviceId;
        this.appName = appName;
        this.status = status;
        this.serviceInstances = serviceInstances;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<ServiceInstance> getServiceInstances() {
        return serviceInstances;
    }

    public void setServiceInstances(List<ServiceInstance> serviceInstances) {
        this.serviceInstances = serviceInstances;
    }

    @Override
    public String toString() {
        return (
            "RouteVM{" +
            "path='" +
            path +
            '\'' +
            ", prefix='" +
            prefix +
            '\'' +
            ", serviceId='" +
            serviceId +
            '\'' +
            ", appName='" +
            appName +
            '\'' +
            ", status='" +
            status +
            '\'' +
            ", serviceInstances=" +
            serviceInstances +
            '}'
        );
    }
}
