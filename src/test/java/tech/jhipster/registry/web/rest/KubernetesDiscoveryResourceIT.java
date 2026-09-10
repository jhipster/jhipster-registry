package tech.jhipster.registry.web.rest;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.test.context.TestPropertySource;
import tech.jhipster.registry.IntegrationTest;

@IntegrationTest
@AutoConfigureMockMvc
@TestPropertySource(properties = { "application.discovery.backend=kubernetes", "eureka.client.enabled=false" })
class KubernetesDiscoveryResourceIT extends AbstractDiscoveryResourceIT {

    @MockBean(name = "kubernetesDiscoveryClient")
    private DiscoveryClient discoveryClient;

    @Override
    protected String provider() {
        return "kubernetes";
    }
}
