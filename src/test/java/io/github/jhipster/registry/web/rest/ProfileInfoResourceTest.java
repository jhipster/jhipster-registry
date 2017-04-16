package io.github.jhipster.registry.web.rest;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import io.github.jhipster.config.JHipsterProperties;

import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(MockitoJUnitRunner.class)
public class ProfileInfoResourceTest {

    private static final String[] profiles = new String[]{"dev"};
    private MockMvc mock;

    @Before
    public void setup() {
        Environment env = Mockito.mock(Environment.class);
        JHipsterProperties prop = Mockito.mock(JHipsterProperties.class);
        JHipsterProperties.Ribbon ribbon = Mockito.mock(JHipsterProperties.Ribbon.class);

        ProfileInfoResource profileInfoResource = new ProfileInfoResource(env, prop);
        this.mock = MockMvcBuilders.standaloneSetup(profileInfoResource).build();

        Mockito.when(env.getActiveProfiles()).thenReturn(profiles);
        Mockito.when(prop.getRibbon()).thenReturn(ribbon);
    }

    @Test
    public void getActiveProfilesTest() throws Exception {
        MvcResult res = mock.perform(get("/api/profile-info")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        assertTrue(res.getResponse().getContentAsString().contains("\"activeProfiles\":[\""+profiles[0]+"\"]"));
    }

}
