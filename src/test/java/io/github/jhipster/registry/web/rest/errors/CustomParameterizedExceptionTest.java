package io.github.jhipster.registry.web.rest.errors;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class CustomParameterizedExceptionTest {

    @Test
    public void getErrorVMTest() throws Exception {
        CustomParameterizedException exc = new CustomParameterizedException("Test");

        try {
            throw exc;
        } catch ( Exception exception ) {
            assertTrue(exception instanceof CustomParameterizedException);

            CustomParameterizedException exceptionCast = (CustomParameterizedException) exception;
            assertNotNull(exceptionCast.getErrorVM());
            assertNotNull(exceptionCast.getErrorVM().getMessage());
            assertEquals("Test", exceptionCast.getErrorVM().getMessage());
        }

        exc = new CustomParameterizedException(null);

        try {
            throw exc;
        } catch ( Exception exception ) {
            assertTrue(exception instanceof CustomParameterizedException);

            CustomParameterizedException exceptionCast = (CustomParameterizedException) exception;
            assertNotNull(exceptionCast.getErrorVM());
            assertNull(exceptionCast.getErrorVM().getMessage());
        }
    }

}
