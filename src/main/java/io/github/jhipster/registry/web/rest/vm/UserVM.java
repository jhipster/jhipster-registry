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

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

/**
 * View Model object for representing a user, with his authorities.
 */
public class UserVM {

    @NotNull
    @Size(min = 1, max = 50)
    private String login;

    private Set<String> authorities;

    public UserVM() {
    }

    public UserVM(String login, Set<String> authorities) {

        this.login = login;
        this.authorities = authorities;
    }

    public String getLogin() {
        return login;
    }

    public Set<String> getAuthorities() {
        return authorities;
    }

    @Override
    public String toString() {
        return "UserVM{" +
            "login='" + login + '\'' +
            ", authorities=" + authorities +
            "}";
    }
}
