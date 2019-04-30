package io.github.jhipster.registry.web.rest.errors;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;

public class ErrorVMTest {

    private static final String message = "Message", description = "Desc";

    private ErrorVM vm1, vm2, vm3;
    private ErrorVM vm1null, vm2null, vm3null;

    @BeforeEach
    public void setup() {
        vm1 = new ErrorVM(message);
        vm2 = new ErrorVM(message, description);
        vm3 = new ErrorVM(message, description, new ArrayList<>());

        vm1null = new ErrorVM(null);
        vm2null = new ErrorVM(null, null);
        vm3null = new ErrorVM(null, null, null);
    }

    @Test
    public void addTest() {
        assertThat(vm1.getFieldErrors()).isNull();
        assertThat(vm2.getFieldErrors()).isNull();
        assertThat(vm3.getFieldErrors()).isNotNull();
        assertThat(vm1null.getFieldErrors()).isNull();
        assertThat(vm2null.getFieldErrors()).isNull();
        assertThat(vm3null.getFieldErrors()).isNull();

        vm1.add("testObjectName", "testField", "testMsg");
        vm2.add("testObjectName", "testField", "testMsg");
        vm3.add("testObjectName", "testField", "testMsg");
        vm1null.add("testObjectName", "testField", "testMsg");
        vm2null.add("testObjectName", "testField", "testMsg");
        vm3null.add("testObjectName", "testField", "testMsg");

        assertThat(vm1.getFieldErrors()).isNotEmpty();
        assertThat(vm2.getFieldErrors()).isNotEmpty();
        assertThat(vm3.getFieldErrors()).isNotEmpty();
        assertThat(vm1null.getFieldErrors()).isNotEmpty();
        assertThat(vm2null.getFieldErrors()).isNotEmpty();
        assertThat(vm3null.getFieldErrors()).isNotEmpty();
    }

    @Test
    public void getMessageTest() throws Exception {
        assertThat(vm1.getMessage()).isEqualTo(message);
        assertThat(vm2.getMessage()).isEqualTo(message);
        assertThat(vm3.getMessage()).isEqualTo(message);
        assertThat(vm1null.getMessage()).isNull();
        assertThat(vm2null.getMessage()).isNull();
        assertThat(vm3null.getMessage()).isNull();
    }

    @Test
    public void getDescriptionTest() {
        assertThat(vm1.getDescription()).isNull();
        assertThat(vm2.getDescription()).isEqualTo(description);
        assertThat(vm3.getDescription()).isEqualTo(description);
        assertThat(vm1null.getDescription()).isNull();
        assertThat(vm2null.getDescription()).isNull();
        assertThat(vm3null.getDescription()).isNull();
    }

    @Test
    public void getFieldErrorsTest() throws Exception {
        assertThat(vm1.getFieldErrors()).isNull();
        assertThat(vm2.getFieldErrors()).isNull();
        assertThat(vm3.getFieldErrors()).isNotNull();
        assertThat(vm1null.getFieldErrors()).isNull();
        assertThat(vm2null.getFieldErrors()).isNull();
        assertThat(vm3null.getFieldErrors()).isNull();

        vm1.add(null, null, null);
        vm2.add(null, null, null);
        vm3.add(null, null, null);
        vm1null.add(null, null, null);
        vm2null.add(null, null, null);
        vm3null.add(null, null, null);

        assertThat(vm1.getFieldErrors().get(0).getMessage()).as(message).isNull();
        assertThat(vm2.getFieldErrors().get(0).getMessage()).as(message).isNull();
        assertThat(vm3.getFieldErrors().get(0).getMessage()).as(message).isNull();
        assertThat(vm1null.getFieldErrors().get(0).getMessage()).as(message).isNull();
        assertThat(vm2null.getFieldErrors().get(0).getMessage()).as(message).isNull();
        assertThat(vm3null.getFieldErrors().get(0).getMessage()).as(message).isNull();

        vm1.add("testObjectName", "testField", "testMsg");
        vm2.add("testObjectName", "testField", "testMsg");
        vm3.add("testObjectName", "testField", "testMsg");
        vm1null.add("testObjectName", "testField", "testMsg");
        vm2null.add("testObjectName", "testField", "testMsg");
        vm3null.add("testObjectName", "testField", "testMsg");

        assertThat(vm1.getFieldErrors().get(1).getMessage()).isEqualTo("testMsg");
        assertThat(vm2.getFieldErrors().get(1).getMessage()).isEqualTo("testMsg");
        assertThat(vm3.getFieldErrors().get(1).getMessage()).isEqualTo("testMsg");
        assertThat(vm1null.getFieldErrors().get(1).getMessage()).isEqualTo("testMsg");
        assertThat(vm2null.getFieldErrors().get(1).getMessage()).isEqualTo("testMsg");
        assertThat(vm3null.getFieldErrors().get(1).getMessage()).isEqualTo("testMsg");
    }

}
