package io.github.jhipster.registry.security.oauth2;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

public class AudienceValidator implements OAuth2TokenValidator<Jwt> {
    OAuth2Error error = new OAuth2Error("invalid_token", "The required audience is missing", null);

    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        System.out.println("===============================");
        System.out.println("Jwt.getAudience(): " + jwt.getAudience());
        System.out.println("===============================");
        if (jwt.getAudience().contains("messaging")) {
            return OAuth2TokenValidatorResult.success();
        } else {
            return OAuth2TokenValidatorResult.failure(error);
        }
    }
}
