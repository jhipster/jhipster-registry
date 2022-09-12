package tech.jhipster.registry.web.rest;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

public class SshResourceTest {

    private SshResource ssh;
    private MockMvc mock;

    @BeforeEach
    public void setup() {
        ssh = spy(new SshResource());
        this.mock = MockMvcBuilders.standaloneSetup(ssh).build();
    }

    @Test
    public void shouldGetSshPublicKey() throws Exception {
        // without key
        doReturn(null).when(ssh).getPublicKey();
        mock.perform(get("/api/ssh/public_key")).andExpect(status().isNotFound());

        // with key
        doReturn("key").when(ssh).getPublicKey();
        mock
            .perform(get("/api/ssh/public_key"))
            .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN))
            .andExpect(content().string("key"))
            .andExpect(status().isOk());
    }
}
