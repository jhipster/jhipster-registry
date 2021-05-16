package tech.jhipster.registry.web.rest.vm;

import static org.assertj.core.api.Assertions.assertThat;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import tech.jhipster.registry.utils.TestUtils;

public class LoginVMTest {

    private static Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void getUsernameTest() {
        LoginVM vm = new LoginVM();
        assertThat(vm.getUsername()).isNull();

        vm.setUsername("fakeUsername");
        assertThat(vm.getUsername()).isEqualTo("fakeUsername");
    }

    @Test
    public void setUsernameTest() {
        LoginVM vm = new LoginVM();
        assertThat(vm.getUsername()).isNull();
        vm.setUsername(null);
        assertThat(vm.getUsername()).isNull();
        vm.setUsername("fakeUsername");
        assertThat(vm.getUsername()).isEqualTo("fakeUsername");

        // Contraints tests
        vm = new LoginVM();
        vm.setPassword("goodPassword");

        assertThat(validator.validate(vm)).isNotEmpty();
        vm.setUsername("");
        assertThat(validator.validate(vm)).isNotEmpty();
        vm.setUsername("badUsernameTooLongbadUsernameTooLongbadUsernameTooLongbadUsernameTooLongbadUsernameTooLong");
        assertThat(validator.validate(vm)).isNotEmpty();
        vm.setUsername("goodUsername");
        assertThat(validator.validate(vm)).isEmpty();
    }

    @Test
    public void getPasswordTest() {
        LoginVM vm = new LoginVM();
        assertThat(vm.getPassword()).isNull();

        vm.setPassword("fakePassword");
        assertThat(vm.getPassword()).isEqualTo("fakePassword");
    }

    @Test
    public void setPasswordTest() {
        LoginVM vm = new LoginVM();
        assertThat(vm.getPassword()).isNull();
        vm.setPassword(null);
        assertThat(vm.getPassword()).isNull();
        vm.setPassword("fakePassword");
        assertThat(vm.getPassword()).isEqualTo("fakePassword");

        // Contraints tests
        vm = new LoginVM();
        vm.setUsername("goodUsername");
        vm.setPassword("goodPassword");
        assertThat(validator.validate(vm)).isEmpty();
    }

    @Test
    public void isRememberMeTest() {
        LoginVM vm = new LoginVM();
        assertThat(vm.isRememberMe()).isFalse();
        vm.setRememberMe(true);
        assertThat(vm.isRememberMe()).isTrue();
    }

    @Test
    public void setRememberMeTest() {
        LoginVM vm = new LoginVM();
        vm.setRememberMe(false);
        assertThat(vm.isRememberMe()).isFalse();
        vm.setRememberMe(true);
        assertThat(vm.isRememberMe()).isTrue();
    }

    @Test
    public void toStringTest() {
        LoginVM vm = new LoginVM();

        assertThat(vm.toString()).startsWith(LoginVM.class.getSimpleName());
        String json = vm.toString().replace(LoginVM.class.getSimpleName(), "");
        assertThat(TestUtils.isValid(json)).isTrue();

        vm = new LoginVM();
        vm.setUsername("fakeUsername");
        vm.setPassword("fakePassword");
        vm.setRememberMe(true);
        json = vm.toString().replace(LoginVM.class.getSimpleName(), "");
        assertThat(TestUtils.isValid(json)).isTrue();
    }
}
