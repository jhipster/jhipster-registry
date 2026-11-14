package tech.jhipster.registry.security;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.StandardClaimNames;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import tech.jhipster.registry.config.Constants;

/**
 * Utility class for Spring Security.
 */
public final class SecurityUtils {

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    public static final String AUTHORITIES_CLAIM = "auth";

    private SecurityUtils() {}

    /**
     * Get the login of the current user.
     *
     * @return the login of the current user.
     */
    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
    }

    private static String extractPrincipal(Authentication authentication) {
        // AnonymousAuthenticationToken has a String principal that would fall through below
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        }
        return null;
    }

    /**
     * Get the JWT of the current user.
     *
     * @return the JWT of the current user.
     */
    public static Optional<String> getCurrentUserJWT() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication()).map(SecurityUtils::extractCredentials);
    }

    private static String extractCredentials(Authentication authentication) {
        if (authentication.getCredentials() instanceof String token) {
            return token;
        } else if (authentication.getCredentials() instanceof Jwt jwt) {
            return jwt.getTokenValue();
        }
        return null;
    }

    /**
     * Check if a user is authenticated.
     *
     * @return true if the user is authenticated, false otherwise.
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && getAuthorities(authentication).noneMatch(AuthoritiesConstants.ANONYMOUS::equals);
    }

    /**
     * Checks if the current user has any of the authorities.
     *
     * @param authorities the authorities to check.
     * @return true if the current user has any of the authorities, false otherwise.
     */
    public static boolean hasCurrentUserAnyOfAuthorities(String... authorities) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && getAuthorities(authentication).anyMatch(authority -> List.of(authorities).contains(authority));
    }

    /**
     * Checks if the current user has none of the authorities.
     *
     * @param authorities the authorities to check.
     * @return true if the current user has none of the authorities, false otherwise.
     */
    public static boolean hasCurrentUserNoneOfAuthorities(String... authorities) {
        return !hasCurrentUserAnyOfAuthorities(authorities);
    }

    /**
     * Checks if the current user has a specific authority.
     *
     * @param authority the authority to check.
     * @return true if the current user has the authority, false otherwise.
     */
    public static boolean hasCurrentUserThisAuthority(String authority) {
        return hasCurrentUserAnyOfAuthorities(authority);
    }

    private static Stream<String> getAuthorities(Authentication authentication) {
        return authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority);
    }

    public static Map<String, Object> extractDetailsFromTokenAttributes(Map<String, Object> attributes) {
        Map<String, Object> details = new HashMap<>();

        details.put("activated", Optional.ofNullable(attributes.get(StandardClaimNames.EMAIL_VERIFIED)).orElse(true));
        Optional.ofNullable(attributes.get("uid")).ifPresent(id -> details.put("id", id));
        Optional.ofNullable(attributes.get(StandardClaimNames.FAMILY_NAME)).ifPresent(lastName -> details.put("lastName", lastName));
        Optional.ofNullable(attributes.get(StandardClaimNames.PICTURE)).ifPresent(imageUrl -> details.put("imageUrl", imageUrl));

        Optional.ofNullable(attributes.get(StandardClaimNames.GIVEN_NAME)).ifPresentOrElse(
            firstName -> details.put("firstName", firstName),
            () -> Optional.ofNullable(attributes.get(StandardClaimNames.NAME)).ifPresent(firstName -> details.put("firstName", firstName))
        );

        if (attributes.get(StandardClaimNames.EMAIL) != null) {
            details.put("email", attributes.get(StandardClaimNames.EMAIL));
        } else {
            String sub = String.valueOf(attributes.get(StandardClaimNames.SUB));
            String preferredUsername = (String) attributes.get(StandardClaimNames.PREFERRED_USERNAME);
            if (sub.contains("|") && preferredUsername != null && preferredUsername.contains("@")) {
                // special handling for Auth0
                details.put("email", preferredUsername);
            } else {
                details.put("email", sub);
            }
        }

        if (attributes.get("langKey") != null) {
            details.put("langKey", attributes.get("langKey"));
        } else if (attributes.get(StandardClaimNames.LOCALE) != null) {
            // trim off country code if it exists
            String locale = (String) attributes.get(StandardClaimNames.LOCALE);
            if (locale.contains("_")) {
                locale = locale.substring(0, locale.indexOf('_'));
            } else if (locale.contains("-")) {
                locale = locale.substring(0, locale.indexOf('-'));
            }
            details.put("langKey", locale.toLowerCase());
        } else {
            // set langKey to default if not specified by IdP
            details.put("langKey", Constants.DEFAULT_LANGUAGE);
        }

        return details;
    }
}
