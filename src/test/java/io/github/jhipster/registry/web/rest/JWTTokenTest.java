package io.github.jhipster.registry.web.rest;

import org.junit.Test;

import static org.junit.Assert.*;

public class JWTTokenTest {

    @Test
    public void getIdTokenTest() throws Exception {
        assertNotNull(new JWTToken("id").getIdToken());
        assertEquals("id", new JWTToken("id").getIdToken());
        assertNull(new JWTToken(null).getIdToken());
    }

    @Test
    public void setIdTokenTest() throws Exception {
        JWTToken token = new JWTToken("id");
        assertNotNull(token.getIdToken());

        assertNotEquals("id2", token.getIdToken());
        token.setIdToken("id2");
        assertEquals("id2", token.getIdToken());

        token.setIdToken(null);
        assertNull(token.getIdToken());

        token = new JWTToken(null);
        token.setIdToken(null);
        assertNull(token.getIdToken());
    }

}
