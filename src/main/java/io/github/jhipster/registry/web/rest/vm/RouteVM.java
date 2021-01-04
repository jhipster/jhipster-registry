/*
 * Copyright 2015-2021 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.github.jhipster.registry.web.rest.vm;

import org.springframework.cloud.client.ServiceInstance;

import java.util.List;

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

    public RouteVM(){}

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
        return "RouteVM{" +
            "path='" + path + '\'' +
            ", prefix='" + prefix + '\'' +
            ", serviceId='" + serviceId + '\'' +
            ", appName='" + appName + '\'' +
            ", status='" + status + '\'' +
            ", serviceInstances=" + serviceInstances +
            '}';
    }

}
