package io.github.jhipster.registry.web.rest;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.codahale.metrics.annotation.Timed;

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
    @RequestMapping(value = "/ssh/public_key",
        method = RequestMethod.GET,
        produces = MediaType.TEXT_PLAIN_VALUE)
    @Timed
    public ResponseEntity<String> eureka() {
        try {
            String publicKey = new String(Files.readAllBytes(
                Paths.get(System.getProperty("user.home") +"/.ssh/id_rsa.pub")));

            return new ResponseEntity<>(publicKey, HttpStatus.OK);
        } catch (IOException e) {
            log.warn("SSH public key could not be loaded: {}", e.getMessage());
            return new ResponseEntity<String>("", HttpStatus.NOT_FOUND);
        }
    }
}
