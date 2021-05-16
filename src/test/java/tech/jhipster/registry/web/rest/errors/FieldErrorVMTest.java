package tech.jhipster.registry.web.rest.errors;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

public class FieldErrorVMTest {

    @Test
    public void getObjectNameTest() {
        FieldErrorVM vm = new FieldErrorVM(null, null, null);
        assertThat(vm.getObjectName()).isNull();
        vm = new FieldErrorVM("dto", "field", "message");
        assertThat(vm.getObjectName()).isEqualTo("dto");
    }

    @Test
    public void getFieldTest() {
        FieldErrorVM vm = new FieldErrorVM(null, null, null);
        assertThat(vm.getField()).isNull();
        vm = new FieldErrorVM("dto", "field", "message");
        assertThat(vm.getField()).isEqualTo("field");
    }

    @Test
    public void getMessageTest() {
        FieldErrorVM vm = new FieldErrorVM(null, null, null);
        assertThat(vm.getMessage()).isNull();
        vm = new FieldErrorVM("dto", "field", "message");
        assertThat(vm.getMessage()).isEqualTo("message");
    }
}
