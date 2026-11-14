package tech.jhipster.registry.security;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

/**
 * Utility class for Spring Security.
 */
public final class SecurityUtils {

    public static final String CLAIMS_NAMESPACE = "https://www.jhipster.tech/";

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    public static final String AUTHORITIES_CLAIM = "auth";

    private static final String FACTOR_AUTHORITY_PREFIX = "FACTOR_";

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
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        } else if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {
            return oauth2Token.getPrincipal().getName();
        } else if (authentication instanceof JwtAuthenticationToken jwtToken) {
            Jwt jwt = jwtToken.getToken();
            String preferredUsername = jwt.getClaimAsString("preferred_username");
            return preferredUsername != null ? preferredUsername : jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof DefaultOidcUser oidcUser) {
            Map<String, Object> attributes = oidcUser.getAttributes();
            if (attributes.containsKey("preferred_username")) {
                return (String) attributes.get("preferred_username");
            }
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
        return (
            authentication != null && getAuthorities(authentication).anyMatch(authority -> Arrays.asList(authorities).contains(authority))
        );
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

    /**
     * Get the authorities of current user
     *
     * @return the authorities of current user
     */
    public static Set<String> getAuthorities() {
        return getAuthorities(SecurityContextHolder.getContext().getAuthentication())
            .filter(SecurityUtils::isRole)
            .collect(Collectors.toSet());
    }

    /**
     * Spring Security 7 also grants an authority for each way a user authenticated, such as
     * {@code FACTOR_PASSWORD} and {@code FACTOR_BEARER}. Those are not roles, and releases
     * before 8.0.0 never reported them.
     *
     * @param authority the name of an authority.
     * @return whether it is a role and not an authentication factor.
     */
    public static boolean isRole(String authority) {
        return !authority.startsWith(FACTOR_AUTHORITY_PREFIX);
    }

    private static Stream<String> getAuthorities(Authentication authentication) {
        return authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority);
    }

    public static List<GrantedAuthority> extractAuthorityFromClaims(Map<String, Object> claims) {
        return mapRolesToGrantedAuthorities(getRolesFromClaims(claims));
    }

    @SuppressWarnings("unchecked")
    private static Collection<String> getRolesFromClaims(Map<String, Object> claims) {
        return (Collection<String>) claims.getOrDefault(
            "groups",
            claims.getOrDefault("roles", claims.getOrDefault(CLAIMS_NAMESPACE + "roles", new ArrayList<>()))
        );
    }

    private static List<GrantedAuthority> mapRolesToGrantedAuthorities(Collection<String> roles) {
        return roles.stream().filter(role -> role.startsWith("ROLE_")).map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }
}
