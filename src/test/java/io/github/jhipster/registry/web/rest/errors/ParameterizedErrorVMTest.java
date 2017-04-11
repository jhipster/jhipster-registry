package io.github.jhipster.registry.web.rest.errors;

import io.github.jhipster.registry.utils.TestUtils;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class ParameterizedErrorVMTest {

    @Test
    public void getMessageTest() {
        ParameterizedErrorVM vm = new ParameterizedErrorVM(null);
        assertNull(vm.getMessage());

        vm = new ParameterizedErrorVM("message", "param1", "param2");
        assertEquals("message", vm.getMessage());
    }

    @Test
    public void getParamsTest() {
        ParameterizedErrorVM vm = new ParameterizedErrorVM(null);
        assertNull(vm.getMessage());

        vm = new ParameterizedErrorVM("message", "param1", "param2");
        assertTrue(vm.getParams().length==2);
    }

    @Test
    public void isSerializable() {
        assertTrue(TestUtils.isSerializable(new ParameterizedErrorVM(null)));
    }

}
