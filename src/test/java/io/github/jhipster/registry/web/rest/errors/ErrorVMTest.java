package io.github.jhipster.registry.web.rest.errors;

import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class ErrorVMTest {

    private static final String message = "Message", description = "Desc";

    private ErrorVM vm1, vm2, vm3;
    private ErrorVM vm1null, vm2null, vm3null;

    @Before
    public void setup(){
        vm1 = new ErrorVM(message);
        vm2 = new ErrorVM(message, description);
        vm3 = new ErrorVM(message, description, new ArrayList<>());

        vm1null = new ErrorVM(null);
        vm2null = new ErrorVM(null, null);
        vm3null = new ErrorVM(null, null, null);
    }

    @Test
    public void addTest() throws Exception {
        assertNull(vm1.getFieldErrors());
        assertNull(vm2.getFieldErrors());
        assertNotNull(vm3.getFieldErrors());
        assertNull(vm1null.getFieldErrors());
        assertNull(vm2null.getFieldErrors());
        assertNull(vm3null.getFieldErrors());

        vm1.add("testObjectName", "testField", "testMsg");
        vm2.add("testObjectName", "testField", "testMsg");
        vm3.add("testObjectName", "testField", "testMsg");
        vm1null.add("testObjectName", "testField", "testMsg");
        vm2null.add("testObjectName", "testField", "testMsg");
        vm3null.add("testObjectName", "testField", "testMsg");

        assertNotNull(vm1.getFieldErrors());
        assertFalse(vm1.getFieldErrors().isEmpty());
        assertNotNull(vm2.getFieldErrors());
        assertFalse(vm2.getFieldErrors().isEmpty());
        assertNotNull(vm3.getFieldErrors());
        assertFalse(vm3.getFieldErrors().isEmpty());
        assertNotNull(vm1null.getFieldErrors());
        assertFalse(vm1null.getFieldErrors().isEmpty());
        assertNotNull(vm2null.getFieldErrors());
        assertFalse(vm2null.getFieldErrors().isEmpty());
        assertNotNull(vm3null.getFieldErrors());
        assertFalse(vm3null.getFieldErrors().isEmpty());
    }

    @Test
    public void getMessageTest() throws Exception {
        assertEquals(message, vm1.getMessage());
        assertEquals(message, vm2.getMessage());
        assertEquals(message, vm3.getMessage());
        assertNull(vm1null.getMessage());
        assertNull(vm2null.getMessage());
        assertNull(vm3null.getMessage());
    }

    @Test
    public void getDescriptionTest() throws Exception {
        assertNull(vm1.getDescription());
        assertEquals(description, vm2.getDescription());
        assertEquals(description, vm3.getDescription());
        assertNull(vm1null.getDescription());
        assertNull(vm2null.getDescription());
        assertNull(vm3null.getDescription());
    }

    @Test
    public void getFieldErrorsTest() throws Exception {
        assertNull(vm1.getFieldErrors());
        assertNull(vm2.getFieldErrors());
        assertNotNull(vm3.getFieldErrors());
        assertNull(vm1null.getFieldErrors());
        assertNull(vm2null.getFieldErrors());
        assertNull(vm3null.getFieldErrors());

        vm1.add(null, null, null);
        vm2.add(null, null, null);
        vm3.add(null, null, null);
        vm1null.add(null, null, null);
        vm2null.add(null, null, null);
        vm3null.add(null, null, null);

        assertNull(message, vm1.getFieldErrors().get(0).getMessage());
        assertNull(message, vm2.getFieldErrors().get(0).getMessage());
        assertNull(message, vm3.getFieldErrors().get(0).getMessage());
        assertNull(message, vm1null.getFieldErrors().get(0).getMessage());
        assertNull(message, vm2null.getFieldErrors().get(0).getMessage());
        assertNull(message, vm3null.getFieldErrors().get(0).getMessage());

        vm1.add("testObjectName", "testField", "testMsg");
        vm2.add("testObjectName", "testField", "testMsg");
        vm3.add("testObjectName", "testField", "testMsg");
        vm1null.add("testObjectName", "testField", "testMsg");
        vm2null.add("testObjectName", "testField", "testMsg");
        vm3null.add("testObjectName", "testField", "testMsg");

        assertEquals("testMsg", vm1.getFieldErrors().get(1).getMessage());
        assertEquals("testMsg", vm2.getFieldErrors().get(1).getMessage());
        assertEquals("testMsg", vm3.getFieldErrors().get(1).getMessage());
        assertEquals("testMsg", vm1null.getFieldErrors().get(1).getMessage());
        assertEquals("testMsg", vm2null.getFieldErrors().get(1).getMessage());
        assertEquals("testMsg", vm3null.getFieldErrors().get(1).getMessage());
    }

}
