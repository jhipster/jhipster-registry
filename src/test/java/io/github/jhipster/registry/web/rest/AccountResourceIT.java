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
package io.github.jhipster.registry.web.rest;

import io.github.jhipster.registry.JHipsterRegistryApp;
import io.github.jhipster.registry.security.AuthoritiesConstants;
import io.github.jhipster.registry.web.rest.errors.ExceptionTranslator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link AccountResource} REST controller.
 */
@SpringBootTest(classes = JHipsterRegistryApp.class)
public class AccountResourceIT {

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        AccountResource accountUserMockResource = new AccountResource();
        this.mockMvc = MockMvcBuilders.standaloneSetup(accountUserMockResource)
                .setControllerAdvice(exceptionTranslator)
                .build();
    }

    @Test
    @WithMockUser(username = "test", roles = "ADMIN")
    public void testGetExistingAccount() throws Exception {
        mockMvc.perform(get("/api/account")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.login").value("test"))
                .andExpect(jsonPath("$.authorities").value(AuthoritiesConstants.ADMIN));
    }

    @Test
    public void testGetUnknownAccount() throws Exception {
        mockMvc.perform(get("/api/account")
                .accept(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(status().isInternalServerError());
    }
}
