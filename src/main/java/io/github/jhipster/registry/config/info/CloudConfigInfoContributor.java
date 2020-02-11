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
