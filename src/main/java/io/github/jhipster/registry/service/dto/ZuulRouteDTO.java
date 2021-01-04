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
package io.github.jhipster.registry.service.dto;

import org.springframework.cloud.netflix.zuul.filters.ZuulProperties;

import javax.validation.constraints.NotNull;
import java.util.Set;

/**
 * Extends a ZuulRoute to add the instance status ("UP", "DOWN", etc...) .
 */
public class ZuulRouteDTO extends ZuulProperties.ZuulRoute {

    private String status;

    public ZuulRouteDTO(String id, String path, String serviceId, String url, boolean stripPrefix, Boolean retryable, @NotNull Set<String> sensitiveHeaders, String status) {
        super(id, path, serviceId, url, stripPrefix, retryable, sensitiveHeaders);
        this.status = status;
    }

    public ZuulRouteDTO(String path, String location, String status) {
        super(path, location);
        this.status = status;
    }

    public ZuulRouteDTO(String status) {
        super();
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
