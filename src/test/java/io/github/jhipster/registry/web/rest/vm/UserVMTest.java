package io.github.jhipster.registry.web.rest.vm;

import io.github.jhipster.registry.utils.TestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;

public class UserVMTest {


    private static Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void getLoginTest() {
        UserVM vm = UserVM.createUser(null, null);
        assertThat(vm.getLogin()).isNull();

        assertThatIllegalArgumentException().isThrownBy(() -> {
            UserVM vm1 = UserVM.createUser("login", null);
            assertThat(vm1.getLogin()).isEqualTo("login");
        });
    }

    @Test
    public void getAuthoritiesTest() {
        UserVM vm = UserVM.createUser(null, null);
        assertThat(vm.getAuthorities()).isNull();

        Set<String> authorities = new HashSet<>();
        authorities.add("authorities1");
        authorities.add("authorities2");
        vm = UserVM.createUser("login", authorities);
        assertThat(vm.getAuthorities()).isEqualTo(authorities);
    }

    @Test
    public void toStringTest() {
        UserVM vm = UserVM.createUser(null, null);

        assertThat(vm.toString()).startsWith(UserVM.class.getSimpleName());
        String json = vm.toString().replace(UserVM.class.getSimpleName(), "");
        assertThat(TestUtils.isValid(json)).isTrue();

        Set<String> authorities = new HashSet<>();
        authorities.add("authorities1");
        authorities.add("authorities2");
        vm = UserVM.createUser("fakeLogin", authorities);
        json = vm.toString().replace(UserVM.class.getSimpleName(), "");
        assertThat(TestUtils.isValid(json)).isTrue();
    }

}
