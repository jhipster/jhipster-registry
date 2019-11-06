package io.github.jhipster.registry.client.keycloak;

import io.github.jhipster.registry.security.AuthoritiesConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;

/**
 * Implementation of {@link GrantedAuthoritiesMapper} for use with Keycloak.
 *
 * Maps the {@link OidcUserAuthority} to {@link SimpleGrantedAuthority}s as follows:
 * <ol>
 *     <li>If claim 'groups' is given, roles are retrieved _only_ from this attribute</li>
 *     <li>If claim 'groups' is _not_ given, roles are retrieved form 'roles' _and_ 'roles2'</li>
 *     <li>Roles are retrieved either from claims in id token or from claims in user info
 *         (but _not_ from both!)</li>
 *     <li>There are a bunch of (boolean) flags to customize the mapping</li>
 * </ol>
 *
 * Non-{@link OidcUserAuthority}s are mapped unaltered (default) or will be discarded. This default
 * is chosen to allow for easy configuration with multiple
 * {@link org.springframework.security.authentication.AuthenticationProvider}s.
 *
 * @author aanno2
 */
public class KeycloakAuthoritiesMapper implements GrantedAuthoritiesMapper {

    private static final Logger LOG = LoggerFactory.getLogger(KeycloakAuthoritiesMapper.class);

    private boolean keepOidcUserAuthority = false;

    private boolean preferUserInfo = true;

    private boolean passNonOidcUserAuthoritiesUnaltered = true;

    private boolean onlyAcceptAuthoritiesWithPrefix = true;

    private boolean addPrefixIfNeeded = false;

    private boolean convertGroupsToUppercase = true;

    private boolean addAnonymousIfNoAuthorities = true;

    public KeycloakAuthoritiesMapper() {
    }

    public void setKeepOidcUserAuthority(boolean keepOidcUserAuthority) {
        this.keepOidcUserAuthority = keepOidcUserAuthority;
    }

    public void setPreferUserInfo(boolean preferUserInfo) {
        this.preferUserInfo = preferUserInfo;
    }

    public void setPassNonOidcUserAuthoritiesUnaltered(boolean passNonOidcUserAuthoritiesUnaltered) {
        this.passNonOidcUserAuthoritiesUnaltered = passNonOidcUserAuthoritiesUnaltered;
    }

    public void setOnlyAcceptAuthoritiesWithPrefix(boolean onlyAcceptAuthoritiesWithPrefix) {
        this.onlyAcceptAuthoritiesWithPrefix = onlyAcceptAuthoritiesWithPrefix;
    }

    public void setAddPrefixIfNeeded(boolean addPrefixIfNeeded) {
        this.addPrefixIfNeeded = addPrefixIfNeeded;
    }

    public void setConvertGroupsToUppercase(boolean convertGroupsToUppercase) {
        this.convertGroupsToUppercase = convertGroupsToUppercase;
    }

    public void setAddAnonymousIfNoAuthorities(boolean addAnonymousIfNoAuthorities) {
        this.addAnonymousIfNoAuthorities = addAnonymousIfNoAuthorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> mapAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<GrantedAuthority> mappedAuthorities = new HashSet<>();

        Set<String> groups = new HashSet<>();
        authorities.forEach(authority -> {
            if (authority instanceof OidcUserAuthority) {
                OidcUserAuthority oidcUserAuthority = (OidcUserAuthority) authority;

                // We will use user info only if there a already
                // at least one authority (OidcUserAuthority).
                // This assumption holds in the general case.

                OidcUserInfo userInfo = oidcUserAuthority.getUserInfo();
                if (preferUserInfo == false || userInfo == null) {
                    // mappedAuthorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
                    addToGroups(groups, oidcUserAuthority.getIdToken().getClaims());
                } else {
                    addToGroups(groups, userInfo.getClaims());
                }
                if (keepOidcUserAuthority) {
                    mappedAuthorities.add(authority);
                }
            } else {
                if (passNonOidcUserAuthoritiesUnaltered) {
                    LOG.warn("Unmapped authority " + authority + " is not of expected type OidcUserAuthority");
                    GrantedAuthority ga = (GrantedAuthority) authority;
                    String roleName = ga.getAuthority();
                    if (roleName != null && (onlyAcceptAuthoritiesWithPrefix == false || roleName.startsWith("ROLE_"))) {
                        mappedAuthorities.add(ga);
                    }
                }
            }
        });
        convertGroupsToGrantedAuthorities(mappedAuthorities, groups);

        return mappedAuthorities;
    }

    private void addToGroups(Set<String> groups, Map<String, Object> claims) {
        Collection<String> toAdd = (Collection<String>) claims.get("groups");
        if (toAdd != null) {
            groups.addAll(toAdd);
        }
        if (groups.isEmpty()) {
            toAdd = (Collection<String>) claims.get("roles");
            if (toAdd != null) {
                groups.addAll(toAdd);
            }
            toAdd = (Collection<String>) claims.get("roles2");
            if (toAdd != null) {
                groups.addAll(toAdd);
            }
        }
    }

    private void convertGroupsToGrantedAuthorities(Set<GrantedAuthority> mappedAuthorities, Set<String> groups) {
        Stream<String> stream = groups.stream()
            .filter(s -> !StringUtils.isEmpty(s))
            .map(String::trim);
        if (convertGroupsToUppercase) {
            stream = stream.map(String::toUpperCase);
        }
        if (onlyAcceptAuthoritiesWithPrefix) {
            stream = stream.filter(group -> group.startsWith("ROLE_"));
        }
        if (addPrefixIfNeeded) {
            stream = stream.map(s -> {
               if (s.toUpperCase().startsWith("ROLE_")) {
                   return s;
               }
               return "ROLE_" + s;
            });
        }
        List<SimpleGrantedAuthority> auths = stream.map(SimpleGrantedAuthority::new).collect(toList());
        mappedAuthorities.addAll(auths);
        if (addAnonymousIfNoAuthorities && mappedAuthorities.isEmpty()) {
            mappedAuthorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.ANONYMOUS));
        }
    }
}
