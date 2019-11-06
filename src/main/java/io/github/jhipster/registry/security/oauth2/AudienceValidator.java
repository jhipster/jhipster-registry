package io.github.jhipster.registry.security.oauth2;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class AudienceValidator implements OAuth2TokenValidator<Jwt> {

    private static final Logger LOG = LoggerFactory.getLogger(AudienceValidator.class);

    private static final OAuth2Error error = new OAuth2Error("invalid_token", "The required audience is missing", null);

    @Value("${oauth2.audience:messaging}")
    private String audience;

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        LOG.info("Jwt.getAudience(): " + jwt.getAudience());
        if (jwt.getAudience().contains(audience)) {
            return OAuth2TokenValidatorResult.success();
        } else {
            return OAuth2TokenValidatorResult.failure(error);
        }
    }
}
