package io.github.jhipster.registry.web.rest.vm;

import io.github.jhipster.registry.utils.TestUtils;
import org.junit.Before;
import org.junit.Test;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class LoginVMTest {

    private static Validator validator;

    @Before
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void getUsernameTest(){
        LoginVM vm = new LoginVM();
        assertNull(vm.getUsername());

        vm.setUsername("fakeUsername");
        assertEquals("fakeUsername", vm.getUsername());
    }

    @Test
    public void setUsernameTest(){
        LoginVM vm = new LoginVM();
        assertNull(vm.getUsername());
        vm.setUsername(null);
        assertNull(vm.getUsername());
        vm.setUsername("fakeUsername");
        assertEquals("fakeUsername", vm.getUsername());

        // Contraints tests
        vm = new LoginVM();
        vm.setPassword("goodPassword");

        assertFalse(validator.validate(vm).isEmpty());
        vm.setUsername("");
        assertFalse(validator.validate(vm).isEmpty());
        vm.setUsername("badUsernameTooLongbadUsernameTooLongbadUsernameTooLongbadUsernameTooLongbadUsernameTooLong");
        assertFalse(validator.validate(vm).isEmpty());
        vm.setUsername("goodUsername");
        assertTrue(validator.validate(vm).isEmpty());
    }

    @Test
    public void getPasswordTest(){
        LoginVM vm = new LoginVM();
        assertNull(vm.getPassword());

        vm.setPassword("fakePassword");
        assertEquals("fakePassword", vm.getPassword());
    }

    @Test
    public void setPasswordTest(){
        LoginVM vm = new LoginVM();
        assertNull(vm.getPassword());
        vm.setPassword(null);
        assertNull(vm.getPassword());
        vm.setPassword("fakePassword");
        assertEquals("fakePassword", vm.getPassword());

        // Contraints tests
        vm = new LoginVM();
        vm.setUsername("goodUsername");
        vm.setPassword("goodPassword");
        assertTrue(validator.validate(vm).isEmpty());
    }


    @Test
    public void isRememberMeTest(){
        LoginVM vm = new LoginVM();
        assertNull(vm.isRememberMe());

        vm.setRememberMe(true);
        assertTrue(vm.isRememberMe());
    }

    @Test
    public void setRememberMeTest(){
        LoginVM vm = new LoginVM();
        assertNull(vm.isRememberMe());
        vm.setRememberMe(null);
        assertNull(vm.isRememberMe());
        vm.setRememberMe(true);
        assertTrue(vm.isRememberMe());
    }

    @Test
    public void toStringTest(){
        LoginVM vm = new LoginVM();

        assertTrue(vm.toString().startsWith(LoginVM.class.getSimpleName()));
        String json = vm.toString().replace(LoginVM.class.getSimpleName(), "");
        assertTrue(TestUtils.isValid(json));

        vm = new LoginVM();
        vm.setUsername("fakeUsername");
        vm.setPassword("fakePassword");
        vm.setRememberMe(true);
        json = vm.toString().replace(LoginVM.class.getSimpleName(), "");
        assertTrue(TestUtils.isValid(json));
    }

}
