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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Controller for getting the SSH public key.
 */
@RestController
@RequestMapping("/api")
public class SshResource {

    private final Logger log = LoggerFactory.getLogger(SshResource.class);

    /**
     * GET  / : get the SSH public key
     */
    @GetMapping(value = "/ssh/public_key", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getSshPublicKey() {
        try {
            String publicKey = getPublicKey();
            if(publicKey != null) return new ResponseEntity<>(publicKey, HttpStatus.OK);
        } catch (IOException e) {
            log.warn("SSH public key could not be loaded: {}", e.getMessage());
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    String getPublicKey() throws IOException {
        return new String(Files.readAllBytes(
            Paths.get(System.getProperty("user.home") + "/.ssh/id_rsa.pub")));
    }
}
