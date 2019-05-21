package io.github.jhipster.registry.security.oauth2;

import io.github.jhipster.config.JHipsterProperties;
import org.apache.commons.codec.binary.Base64;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.jwt.Jwt;
import org.springframework.security.jwt.JwtHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static io.github.jhipster.registry.config.Constants.PROFILE_UAA;

@Service
@Profile(PROFILE_UAA)
public class OAuth2ClientCredentialsService {

    private RestTemplate restTemplate;
    private JHipsterProperties jHipsterProperties;

    private String accessToken;

    public OAuth2ClientCredentialsService(RestTemplate restTemplate, JHipsterProperties jHipsterProperties) {
        this.restTemplate = restTemplate;
        this.jHipsterProperties = jHipsterProperties;
    }

    public String getAccessToken() {
        if (accessToken == null) {
            retrieveNewAccessToken();
        }

        Jwt jwt = JwtHelper.decode(accessToken);
        String claims = jwt.getClaims();
        JsonParser jsonParser = JsonParserFactory.getJsonParser();
        Map<String, Object> claimMap = jsonParser.parseMap(claims);
        Integer exp = (Integer) claimMap.get("exp");
        int now = (int) (System.currentTimeMillis() / 1000L);

        if (exp < now) {
            retrieveNewAccessToken();
        }

        return accessToken;
    }

    private void retrieveNewAccessToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        final String authString = jHipsterProperties.getSecurity().getClientAuthorization().getClientId() + ":" + jHipsterProperties.getSecurity().getClientAuthorization().getClientSecret();
        final String authorization = "Basic " + Base64.encodeBase64String(authString.getBytes());
        headers.add("Authorization", authorization);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "client_credentials");

        /*HttpEntity<?> requestEntity = new HttpEntity<>(map, headers);
        ResponseEntity<DefaultOAuth2AccessToken> responseEntity = this.restTemplate.exchange("http://UAA/oauth/token", HttpMethod.POST, requestEntity, DefaultOAuth2AccessToken.class);

        if (!responseEntity.getStatusCode().is2xxSuccessful()) {
            //TODO
        }

        accessToken = Objects.requireNonNull(responseEntity.getBody()).getValue();*/
    }
}
