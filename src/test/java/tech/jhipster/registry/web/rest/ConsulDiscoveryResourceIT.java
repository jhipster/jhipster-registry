package tech.jhipster.registry.web.rest;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.test.context.TestPropertySource;
import tech.jhipster.registry.IntegrationTest;

@IntegrationTest
@AutoConfigureMockMvc
@TestPropertySource(properties = { "application.discovery.backend=consul", "eureka.client.enabled=false" })
class ConsulDiscoveryResourceIT extends AbstractDiscoveryResourceIT {

    @MockBean(name = "consulDiscoveryClient")
    private DiscoveryClient discoveryClient;

    @Override
    protected String provider() {
        return "consul";
    }
}
