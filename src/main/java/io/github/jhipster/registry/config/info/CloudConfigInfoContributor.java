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
package io.github.jhipster.registry.config.info;

import io.github.jhipster.registry.config.ConfigServerConfig;
import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.cloud.config.client.ConfigClientProperties;
import org.springframework.stereotype.Component;

@Component
public class CloudConfigInfoContributor implements InfoContributor {

    private final ConfigServerConfig configServerConfig;

    private final ConfigClientProperties configClientProperties;

    public CloudConfigInfoContributor(ConfigServerConfig configServerConfig, ConfigClientProperties configClientProperties) {
        this.configServerConfig = configServerConfig;
        this.configClientProperties = configClientProperties;
    }

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("cloud-config-label", configClientProperties.getLabel());
        builder.withDetail("cloud-config-server-configuration-sources", configServerConfig.getComposite());
    }
}
