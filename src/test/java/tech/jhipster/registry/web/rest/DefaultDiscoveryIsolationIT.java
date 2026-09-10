package tech.jhipster.registry.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Locale;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import tech.jhipster.registry.IntegrationTest;

/** Run unchanged with either optional Maven profile to prove opt-in classpath isolation. */
@IntegrationTest
@AutoConfigureMockMvc
class DefaultDiscoveryIsolationIT {

    @Autowired
    private ApplicationContext context;

    @Autowired
    private Environment environment;

    @Autowired
    private MockMvc mvc;

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void staysOnEurekaWithOptionalProviderJarsPresent() throws Exception {
        assertThat(environment.getProperty("spring.cloud.consul.enabled", Boolean.class)).isFalse();
        assertThat(environment.getProperty("spring.cloud.kubernetes.enabled", Boolean.class)).isFalse();
        assertThat(environment.getActiveProfiles()).doesNotContain("consul", "kubernetes");
        assertThat(context.containsBean("consulDiscoveryClient")).isFalse();
        assertThat(context.containsBean("kubernetesDiscoveryClient")).isFalse();
        assertThat(context.getBeansOfType(DiscoveryClient.class).values())
            .noneMatch(client -> {
                String type = client.getClass().getName().toLowerCase(Locale.ROOT);
                return type.contains("consul") || type.contains("kubernetes");
            });
        mvc.perform(get("/api/eureka/status")).andExpect(status().isOk()).andExpect(jsonPath("$.status.backend").value("eureka"));
    }
}
