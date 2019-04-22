package io.github.jhipster.registry.filters.responserewriting;

import com.netflix.zuul.context.RequestContext;
import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.zip.GZIPInputStream;

import static io.github.jhipster.registry.filters.responserewriting.SwaggerBasePathRewritingFilter.gzipData;
import static org.assertj.core.api.Assertions.assertThat;
import static springfox.documentation.swagger2.web.Swagger2Controller.DEFAULT_URL;

/**
 * Tests SwaggerBasePathRewritingFilter class.
 */
public class SwaggerBasePathRewritingFilterTest {

    private SwaggerBasePathRewritingFilter filter = new SwaggerBasePathRewritingFilter();

    @Test
    public void shouldFilter_on_default_swagger_url() {

        MockHttpServletRequest request = new MockHttpServletRequest("GET", DEFAULT_URL);
        RequestContext.getCurrentContext().setRequest(request);

        assertThat(filter.shouldFilter()).isTrue();
    }

    /**
     * Zuul DebugFilter can be triggered by "deug" parameter.
     */
    @Test
    public void shouldFilter_on_default_swagger_url_with_param() {

        MockHttpServletRequest request = new MockHttpServletRequest("GET", DEFAULT_URL);
        request.setParameter("debug", "true");
        RequestContext.getCurrentContext().setRequest(request);

        assertThat(filter.shouldFilter()).isTrue();
    }

    @Test
    public void shouldNotFilter_on_wrong_url() {

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/management/info");
        RequestContext.getCurrentContext().setRequest(request);

        assertThat(filter.shouldFilter()).isFalse();
    }

    @Test
    public void run_on_valid_response() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/service1" + DEFAULT_URL);
        RequestContext context = RequestContext.getCurrentContext();
        context.setRequest(request);

        MockHttpServletResponse response = new MockHttpServletResponse();
        context.setResponseGZipped(false);
        context.setResponse(response);

        InputStream in = IOUtils.toInputStream("{\"basePath\":\"/\"}", StandardCharsets.UTF_8);
        context.setResponseDataStream(in);

        filter.run();

        assertThat(response.getCharacterEncoding()).isEqualTo("UTF-8");
        assertThat(context.getResponseBody()).isEqualTo("{\"basePath\":\"/service1\"}");
    }

    @Test
    public void run_on_valid_response_gzip() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/service1" + DEFAULT_URL);
        RequestContext context = RequestContext.getCurrentContext();
        context.setRequest(request);

        MockHttpServletResponse response = new MockHttpServletResponse();
        context.setResponseGZipped(true);
        context.setResponse(response);

        context.setResponseDataStream(new ByteArrayInputStream(gzipData("{\"basePath\":\"/\"}")));

        filter.run();

        assertThat(response.getCharacterEncoding()).isEqualTo("UTF-8");

        InputStream responseDataStream = new GZIPInputStream(context.getResponseDataStream());
        String responseBody = IOUtils.toString(responseDataStream, StandardCharsets.UTF_8);
        assertThat(responseBody).isEqualTo("{\"basePath\":\"/service1\"}");
    }
}
