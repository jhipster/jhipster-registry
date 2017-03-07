package io.github.jhipster.registry.web.rest;

import com.codahale.metrics.annotation.Timed;
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
    @Timed
    public ResponseEntity<String> eureka() {
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
