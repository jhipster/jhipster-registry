package tech.jhipster.registry.web.rest.errors;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashMap;
import java.util.Map;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import tech.jhipster.registry.utils.TestUtils;

public class ParameterizedErrorVMTest {

    @Test
    public void getMessageTest() {
        ParameterizedErrorVM vm = new ParameterizedErrorVM(null, null);
        assertThat(vm.getMessage()).isNull();
        Map<String, String> paramMap = new HashMap<>();
        paramMap.put("param1", "param1");
        paramMap.put("param2", "param2");
        vm = new ParameterizedErrorVM("message", paramMap);
        assertThat(vm.getMessage()).isEqualTo("message");
    }

    @Test
    public void getParamsTest() {
        ParameterizedErrorVM vm = new ParameterizedErrorVM(null, null);
        assertThat(vm.getMessage()).isNull();
        Map<String, String> paramMap = new HashMap<>();
        paramMap.put("param1", "param1");
        paramMap.put("param2", "param2");
        vm = new ParameterizedErrorVM("message", paramMap);
        assertThat(vm.getParams()).hasSize(2);
    }

    @Test
    public void isSerializable() {
        Assertions.assertThat(TestUtils.isSerializable(new ParameterizedErrorVM(null, null))).isTrue();
    }
}
