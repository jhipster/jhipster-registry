package io.github.jhipster.registry.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to the JHipster Registry.
 *
 */
@ConfigurationProperties(prefix = "jhipster-registry.proxy", ignoreUnknownFields = false)
public class ApplicationProperties {
    private Integer zuulUpdaterFrequencyMs;

    public Integer getZuulUpdaterFrequencyMs() {
        return zuulUpdaterFrequencyMs;
    }

    public void setZuulUpdaterFrequencyMs(Integer zuulUpdaterFrequencyMs) {
        this.zuulUpdaterFrequencyMs = zuulUpdaterFrequencyMs;
    }
}
