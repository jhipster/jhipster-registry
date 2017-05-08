package io.github.jhipster.registry.web.rest.vm;

import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class EurekaVMTest {

    private EurekaVM eureka;

    @Before
    public void setup(){
        eureka = new EurekaVM();
    }

    @Test
    public void getApplicationsTest() throws Exception {
        List<Map<String, Object>> list = eureka.getApplications();
        assertNull(list);

        eureka.setApplications(initFakeApplicationsList());

        list = eureka.getApplications();
        assertNotNull(list);
        assertTrue(list.size()==2);
    }

    @Test
    public void setApplicationsTest() throws Exception {
        assertNull(eureka.getApplications());
        eureka.setApplications(initFakeApplicationsList());
        assertNotNull(eureka.getApplications());

        List<Map<String, Object>> newList = new ArrayList<>();
        eureka.setApplications(newList);
        assertEquals(newList, eureka.getApplications());
    }

    @Test
    public void getStatusTest() throws Exception {
        Map<String, Object> status = eureka.getStatus();
        assertNull(status);

        eureka.setStatus(initFakeStatus());

        status = eureka.getStatus();
        assertNotNull(status);
        assertTrue(status.size()==3);
    }

    @Test
    public void setStatusTest() throws Exception {
        assertNull(eureka.getStatus());
        eureka.setStatus(initFakeStatus());
        assertNotNull(eureka.getStatus());

        Map<String, Object> newStatus = new HashMap<>();
        eureka.setStatus(newStatus);
        assertEquals(newStatus, eureka.getStatus());
    }

    private List<Map<String, Object>> initFakeApplicationsList(){
        List<Map<String, Object>> list = new ArrayList<>();

        Map<String, Object> map = new HashMap<>();
        map.put("App1", new Object());
        map.put("App2", new Object());
        list.add(map);

        map = new HashMap<>();
        list.add(map);

        return list;
    }

    private Map<String, Object> initFakeStatus(){
        Map<String, Object> map = new HashMap<>();
        map.put("Status1", new Object());
        map.put("Status2", new Object());
        map.put("Status3", new Object());
        return map;
    }

}
