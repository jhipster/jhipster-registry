package io.github.jhipster.registry.web.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.jhipster.registry.JHipsterRegistryApp;
import io.github.jhipster.registry.config.Constants;
import io.github.jhipster.registry.security.jwt.TokenProvider;
import io.github.jhipster.registry.web.rest.vm.LoginVM;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = JHipsterRegistryApp.class)
public class UserJWTControllerTest {

    @MockBean
    private TokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    private MockMvc mock;

    @BeforeEach
    public void setup() {
        UserJWTController control = new UserJWTController(tokenProvider, authenticationManager);
        this.mock = MockMvcBuilders.standaloneSetup(control).build();
    }

    @Test
    public void normalAuthentication() throws Exception {
        // Normal authentication
        LoginVM vm = new LoginVM();
        vm.setUsername("admin");
        vm.setPassword("admin");
        vm.setRememberMe(true);

        doReturn("fakeToken").when(tokenProvider)
            .createToken(Mockito.any(Authentication.class), Mockito.anyBoolean());

        mock.perform(post("/api/authenticate")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN, MediaType.ALL)
            .content(new ObjectMapper().writeValueAsString(vm)))
            .andExpect(content().string("{\"id_token\":\"fakeToken\"}"))
            .andExpect(status().isOk());
    }

    @Test
    public void authenticationException() throws Exception {
        // Authentication exception throws
        doThrow(new AuthenticationException(null){}).when(tokenProvider)
            .createToken(Mockito.any(Authentication.class), Mockito.anyBoolean());

        MvcResult res = mock.perform(post("/api/authenticate")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN, MediaType.ALL)
            .content("{\"username\":\"fakeUsername\",\"password\":\"fakePassword\",\"rememberMe\":false}"))
            .andExpect(status().isUnauthorized())
            .andReturn();

        assertThat(res.getResponse().getContentAsString()).startsWith("{\"AuthenticationException\"");
    }

    @Test
    public void badCredentials() throws Exception {
        LoginVM vm = new LoginVM();
        vm.setUsername("badcred");
        vm.setPassword("badcred");
        vm.setRememberMe(true);

        mock.perform(post("/api/authenticate")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN, MediaType.ALL)
            .content(new ObjectMapper().writeValueAsString(vm)))
            .andExpect(status().isUnauthorized())
            .andExpect(content().string("{\"AuthenticationException\":\"Bad credentials\"}"));
    }

    @Test
    public void getIdTokenTest() {
        assertThat(new UserJWTController.JWTToken("id").getIdToken()).isNotNull();
        assertThat(new UserJWTController.JWTToken("id").getIdToken()).isEqualTo("id");
        assertThat(new UserJWTController.JWTToken(null).getIdToken()).isNull();
    }

    @Test
    public void setIdTokenTest() {
        UserJWTController.JWTToken token = new UserJWTController.JWTToken("id");
        assertThat(token.getIdToken()).isNotNull();

        assertThat(token.getIdToken()).isNotEqualTo("id2");
        token.setIdToken("id2");
        assertThat(token.getIdToken()).isEqualTo("id2");

        token.setIdToken(null);
        assertThat(token.getIdToken()).isNull();

        token = new UserJWTController.JWTToken(null);
        token.setIdToken(null);
        assertThat(token.getIdToken()).isNull();
    }
}
