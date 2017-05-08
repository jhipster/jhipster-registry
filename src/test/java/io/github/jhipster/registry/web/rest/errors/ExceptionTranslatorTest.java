package io.github.jhipster.registry.web.rest.errors;

import io.github.jhipster.registry.web.rest.AccountResource;
import io.github.jhipster.registry.web.rest.UserJWTController;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static org.hamcrest.CoreMatchers.instanceOf;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(MockitoJUnitRunner.class)
public class ExceptionTranslatorTest {

    private MockMvc mock;

    @Before
    public void setup() {
        SecurityContextHolder.clearContext();
        AccountResource control = new AccountResource();
        this.mock = MockMvcBuilders.standaloneSetup(control)
            .setControllerAdvice(new ExceptionTranslator())
            .build();
    }

    @Test
    public void processValidationErrorTest() throws Exception {
        UserJWTController control = new UserJWTController(null, null);
        MockMvc jwtMock = MockMvcBuilders.standaloneSetup(control)
            .setControllerAdvice(new ExceptionTranslator())
            .build();
        MvcResult res = jwtMock.perform(post("/api/authenticate")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN, MediaType.ALL)
            .content("{\"username\":\"fakeUsernameTooLongfakeUsernameTooLongfakeUsernameTooLongfakeUsernameTooLong" +
                "\",\"password\":\"fakePassword\",\"rememberMe\":false}"))
            .andExpect(status().isBadRequest())
            .andReturn();

        assertThat(res.getResolvedException(), instanceOf(MethodArgumentNotValidException.class));
    }


    @Test
    public void processParameterizedValidationErrorTest() throws Exception {
        // These lines will throw the wanted exception
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenThrow(new CustomParameterizedException(null));
        SecurityContextHolder.setContext(securityContext);

        MvcResult res = mock.perform(get("/api/account"))
            .andExpect(status().isBadRequest())
            .andReturn();

        assertThat(res.getResolvedException(), instanceOf(CustomParameterizedException.class));
    }

    @Test
    public void processAccessDeniedExceptionTest() throws Exception {
        // These lines will throw the wanted exception
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenThrow(new AccessDeniedException(null));
        SecurityContextHolder.setContext(securityContext);

        MvcResult res = mock.perform(get("/api/account"))
            .andExpect(status().isForbidden())
            .andReturn();

        assertThat(res.getResolvedException(), instanceOf(AccessDeniedException.class));
    }

    @Test
    public void processMethodNotSupportedExceptionTest() throws Exception {
        MvcResult res = mock.perform(post("/api/account")
            .content("{\"testFakeParam\"}"))
            .andExpect(status().isMethodNotAllowed())
            .andReturn();

        assertThat(res.getResolvedException(), instanceOf(HttpRequestMethodNotSupportedException.class));
    }

    @Test
    public void processRuntimeExceptionTest() throws Exception {

        // These lines will throw the wanted exception
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenThrow(new RuntimeException());
        SecurityContextHolder.setContext(securityContext);

        MvcResult res = mock.perform(get("/api/account"))
            .andExpect(status().isInternalServerError())
            .andReturn();

        assertThat(res.getResolvedException(), instanceOf(RuntimeException.class));
    }

}
