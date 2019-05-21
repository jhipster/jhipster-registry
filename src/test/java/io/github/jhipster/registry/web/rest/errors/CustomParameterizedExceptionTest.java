package io.github.jhipster.registry.web.rest.errors;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CustomParameterizedExceptionTest {

    @Test
    public void getErrorVMTest() {
        CustomParameterizedException exc = new CustomParameterizedException("Test");

        try {
            throw exc;
        } catch (Exception exception) {
            assertThat(exception).isInstanceOf(CustomParameterizedException.class);

            CustomParameterizedException exceptionCast = (CustomParameterizedException) exception;
            assertThat(exceptionCast.getErrorVM()).isNotNull();
            assertThat(exceptionCast.getErrorVM().getMessage()).isNotNull();
            assertThat(exceptionCast.getErrorVM().getMessage()).isEqualTo("Test");
        }

        exc = new CustomParameterizedException(null);

        try {
            throw exc;
        } catch (Exception exception) {
            assertThat(exception).isInstanceOf(CustomParameterizedException.class);

            CustomParameterizedException exceptionCast = (CustomParameterizedException) exception;
            assertThat(exceptionCast.getErrorVM()).isNotNull();
            assertThat(exceptionCast.getErrorVM().getMessage()).isNull();
        }
    }

}
