/*
 * Copyright 2015-2021 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.github.jhipster.registry.web.rest.vm;

import io.github.jhipster.registry.utils.TestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import static org.assertj.core.api.Assertions.assertThat;

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
        assertThat(vm.isRememberMe()).isNull();

        vm.setRememberMe(true);
        assertThat(vm.isRememberMe()).isTrue();
    }

    @Test
    public void setRememberMeTest() {
        LoginVM vm = new LoginVM();
        assertThat(vm.isRememberMe()).isNull();
        vm.setRememberMe(null);
        assertThat(vm.isRememberMe()).isNull();
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
