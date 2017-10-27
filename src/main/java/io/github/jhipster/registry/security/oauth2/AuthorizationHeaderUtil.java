package io.github.jhipster.registry.security.oauth2;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

public class AuthorizationHeaderUtil {

    public static String getAuthorizationHeader() {
        OAuth2AuthenticationDetails details =
            (OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();

        return String.format("%s %s", details.getTokenType(), details.getTokenValue());
    }
}
