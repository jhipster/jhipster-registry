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
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class UserVMTest {


    private static Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void constructorTest() {
        UserVM vm = new UserVM(null, null);
        assertThat(validator.validate(vm)).isNotEmpty();
        vm = new UserVM("", null);
        assertThat(validator.validate(vm)).isNotEmpty();
        vm = new UserVM("badLoginTooLongbadLoginTooLongbadLoginTooLongbadLoginTooLong", null);
        assertThat(validator.validate(vm)).isNotEmpty();
        vm = new UserVM("goodLogin", null);
        assertThat(validator.validate(vm)).isEmpty();
    }

    @Test
    public void getLoginTest() {
        UserVM vm = new UserVM();
        assertThat(vm.getLogin()).isNull();

        vm = new UserVM("login", null);
        assertThat(vm.getLogin()).isEqualTo("login");
    }

    @Test
    public void getAuthoritiesTest() {
        UserVM vm = new UserVM();
        assertThat(vm.getAuthorities()).isNull();

        Set<String> authorities = new HashSet<>();
        authorities.add("authorities1");
        authorities.add("authorities2");
        vm = new UserVM("login", authorities);
        assertThat(vm.getAuthorities()).isEqualTo(authorities);
    }

    @Test
    public void toStringTest() {
        UserVM vm = new UserVM();

        assertThat(vm.toString()).startsWith(UserVM.class.getSimpleName());
        String json = vm.toString().replace(UserVM.class.getSimpleName(), "");
        assertThat(TestUtils.isValid(json)).isTrue();

        Set<String> authorities = new HashSet<>();
        authorities.add("authorities1");
        authorities.add("authorities2");
        vm = new UserVM("fakeLogin", authorities);
        json = vm.toString().replace(UserVM.class.getSimpleName(), "");
        assertThat(TestUtils.isValid(json)).isTrue();
    }

}
