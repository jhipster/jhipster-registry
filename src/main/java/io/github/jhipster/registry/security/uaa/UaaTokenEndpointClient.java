package io.github.jhipster.registry.security.uaa;

import io.github.jhipster.config.JHipsterProperties;
import io.github.jhipster.registry.config.Constants;
import io.github.jhipster.registry.config.uaa.OAuth2Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.Base64Utils;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;

/**
 * Client talking to UAA's token endpoint to do different OAuth2 grants.
 */
@Component
@Profile(Constants.PROFILE_UAA)
public class UaaTokenEndpointClient extends OAuth2TokenEndpointClientAdapter implements OAuth2TokenEndpointClient {
    private final Logger log = LoggerFactory.getLogger(UaaTokenEndpointClient.class);

    public UaaTokenEndpointClient(@Qualifier("loadBalancedRestTemplate") RestTemplate restTemplate,
                                  JHipsterProperties jHipsterProperties, OAuth2Properties oAuth2Properties) {
        super(restTemplate, jHipsterProperties, oAuth2Properties);
    }

    @Override
    protected void addAuthentication(HttpHeaders reqHeaders, MultiValueMap<String, String> formParams) {
        reqHeaders.add("Authorization", getAuthorizationHeader());
    }

    /**
     * @return a Basic authorization header to be used to talk to UAA.
     */
    protected String getAuthorizationHeader() {
        String clientId = getClientId();
        String clientSecret = getClientSecret();
        String authorization = clientId + ":" + clientSecret;
        return "Basic " + Base64Utils.encodeToString(authorization.getBytes(StandardCharsets.UTF_8));
    }

}
