package tech.jhipster.registry.web.rest.vm;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import tech.jhipster.registry.discovery.RegistryApplication;

public class EurekaVMTest {

    private EurekaVM eureka;

    @BeforeEach
    public void setup() {
        eureka = new EurekaVM();
    }

    @Test
    public void getApplicationsTest() {
        List<RegistryApplication> list = eureka.getApplications();
        assertThat(list).isNull();

        eureka.setApplications(initFakeApplicationsList());

        list = eureka.getApplications();
        assertThat(list).isNotNull();
        assertThat(list).hasSize(2);
    }

    @Test
    public void setApplicationsTest() {
        assertThat(eureka.getApplications()).isNull();
        eureka.setApplications(initFakeApplicationsList());
        assertThat(eureka.getApplications()).isNotNull();

        List<RegistryApplication> newList = new ArrayList<>();
        eureka.setApplications(newList);
        assertThat(eureka.getApplications()).isEqualTo(newList);
    }

    @Test
    public void getStatusTest() {
        Map<String, Object> status = eureka.getStatus();
        assertThat(status).isNull();

        eureka.setStatus(initFakeStatus());

        status = eureka.getStatus();
        assertThat(status).isNotNull();
        assertThat(status).hasSize(3);
    }

    @Test
    public void setStatusTest() {
        assertThat(eureka.getStatus()).isNull();
        eureka.setStatus(initFakeStatus());
        assertThat(eureka.getStatus()).isNotNull();

        Map<String, Object> newStatus = new HashMap<>();
        eureka.setStatus(newStatus);
        assertThat(eureka.getStatus()).isEqualTo(newStatus);
    }

    private List<RegistryApplication> initFakeApplicationsList() {
        List<RegistryApplication> list = new ArrayList<>();
        list.add(new RegistryApplication("app1"));
        list.add(new RegistryApplication("app2"));

        return list;
    }

    private Map<String, Object> initFakeStatus() {
        Map<String, Object> map = new HashMap<>();
        map.put("Status1", new Object());
        map.put("Status2", new Object());
        map.put("Status3", new Object());
        return map;
    }
}
