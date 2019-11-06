package io.github.jhipster.registry.client.keycloak;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import java.util.*;

/**
 * Stolen from https://github.com/thomasdarimont/spring-boot-2-keycloak-oauth-example.git
 * Enhanced with stuff from {@link OidcUserService}
 * <p>
 * To avoid cyclic dependencies, this bean contains code to resolve dependencies in
 * @PostConstruct .
 *
 * @author aanno2
 */
public class KeycloakOidcUserService extends OidcUserService implements ApplicationContextAware {

    private static final String INVALID_USER_INFO_RESPONSE_ERROR_CODE = "invalid_user_info_response";

    private static final String NAME_ATTRIBUTE_KEY = "preferred_username";

    private static final Set<String> userInfoScopes = Collections.unmodifiableSet(new HashSet<>(
        Arrays.asList(OidcScopes.PROFILE, OidcScopes.EMAIL, OidcScopes.ADDRESS, OidcScopes.PHONE)));

    private static final OAuth2Error INVALID_REQUEST = new OAuth2Error(OAuth2ErrorCodes.INVALID_REQUEST);

    private static final Logger LOG = LoggerFactory.getLogger(KeycloakOidcUserService.class);

    @Autowired
    private JwtDecoder jwtDecoder;

    @Autowired(required = false)
    private GrantedAuthoritiesMapper authoritiesMapper;

    @Autowired
    private KeycloakOidcUserService keycloakOidcUserService;

    // from ApplicationContextAware
    private ApplicationContext applicationContext;

    // retrieve user info (if possible)
    private boolean preferUserInfo = true;

    public KeycloakOidcUserService() {
    }

    @PostConstruct
    void init() {
        if (jwtDecoder == null) {
            // required
            jwtDecoder = applicationContext.getBean(JwtDecoder.class);
        }
        if (authoritiesMapper == null) {
            // optional
            if (applicationContext.getBeanNamesForType(GrantedAuthoritiesMapper.class).length > 0) {
                authoritiesMapper = applicationContext.getBean(GrantedAuthoritiesMapper.class);
            }
        }
        if (keycloakOidcUserService == null) {
            // required
            keycloakOidcUserService = applicationContext.getBean(KeycloakOidcUserService.class);
            // ??? also set this in the underlying OidcUserService
            this.setOauth2UserService((OAuth2UserService) keycloakOidcUserService);
        }
    }

    public void setJwtDecoder(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    public void setAuthoritiesMapper(GrantedAuthoritiesMapper authoritiesMapper) {
        this.authoritiesMapper = authoritiesMapper;
    }

    public void setPreferUserInfo(boolean preferUserInfo) {
        this.preferUserInfo = preferUserInfo;
    }

    public void setKeycloakOidcUserService(KeycloakOidcUserService keycloakOidcUserService) {
        this.keycloakOidcUserService = keycloakOidcUserService;
    }

    /**
     * Augments {@link OidcUserService#loadUser(OidcUserRequest)} to add authorities
     * provided by Keycloak.
     * <p>
     * Needed because {@link OidcUserService#loadUser(OidcUserRequest)} (currently)
     * does not provide a hook for adding custom authorities from a
     * {@link OidcUserRequest}.
     */
    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {

        OidcUser user = super.loadUser(userRequest);
        // This will be null for KC because KeycloakAccessTokenResponseClient is NOT used in parent class.
        OidcUserInfo userInfo = user.getUserInfo();

        Set<GrantedAuthority> authorities = new LinkedHashSet<>();
        authorities.addAll(user.getAuthorities());
        // remove ROLE_USER that is always added by OidcUserService
        // TODO: An interesting alternative would be to inspect OidcUserAuthority/OAuth2UserAuthority
        // and retrieve the attributes (and remap them to authorities?)
        // authorities = authorities.stream().filter(ga -> !"ROLE_USER".equals(ga.getAuthority())).collect(Collectors.toSet());

        authorities.addAll(extractKeycloakAuthorities(userRequest));

        if (preferUserInfo) {
            userInfo = userInfo(userRequest, user);
            if (user.getUserInfo() == null) {
                // ???
                user = new DefaultOidcUser(user.getAuthorities(), user.getIdToken(), userInfo, NAME_ATTRIBUTE_KEY);
            }
        }

        // apply authoritiesMapper
        if (authoritiesMapper != null) {
            authorities = new HashSet<>(authoritiesMapper.mapAuthorities(authorities));
        }

        return new DefaultOidcUser(authorities, userRequest.getIdToken(), userInfo, NAME_ATTRIBUTE_KEY);
    }

    private OidcUserInfo userInfo(OidcUserRequest userRequest, OidcUser user) {
        OidcUserInfo userInfo = null;
        if (this.shouldRetrieveUserInfo(userRequest)) {
            // WARNING: next line leads to endless recursion
            // OAuth2User oauth2User = this.keycloakOidcUserService.loadUser(userRequest);
            userInfo = new OidcUserInfo(user.getClaims());

            // https://openid.net/specs/openid-connect-core-1_0.html#UserInfoResponse

            // 1) The sub (subject) Claim MUST always be returned in the UserInfo Response
            if (userInfo.getSubject() == null) {
                OAuth2Error oauth2Error = new OAuth2Error(INVALID_USER_INFO_RESPONSE_ERROR_CODE);
                throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
            }

            // 2) Due to the possibility of token substitution attacks (see Section 16.11),
            // the UserInfo Response is not guaranteed to be about the End-User
            // identified by the sub (subject) element of the ID Token.
            // The sub Claim in the UserInfo Response MUST be verified to exactly match
            // the sub Claim in the ID Token; if they do not match,
            // the UserInfo Response values MUST NOT be used.
            if (!userInfo.getSubject().equals(userRequest.getIdToken().getSubject())) {
                OAuth2Error oauth2Error = new OAuth2Error(INVALID_USER_INFO_RESPONSE_ERROR_CODE);
                throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
            }
        }
        return userInfo;
    }

    private boolean shouldRetrieveUserInfo(OidcUserRequest userRequest) {
        // Auto-disabled if UserInfo Endpoint URI is not provided
        if (StringUtils.isEmpty(userRequest.getClientRegistration().getProviderDetails()
            .getUserInfoEndpoint().getUri())) {

            return false;
        }

        // The Claims requested by the profile, email, address, and phone scope values
        // are returned from the UserInfo Endpoint (as described in Section 5.3.2),
        // when a response_type value is used that results in an Access Token being issued.
        // However, when no Access Token is issued, which is the case for the response_type=id_token,
        // the resulting Claims are returned in the ID Token.
        // The Authorization Code Grant Flow, which is response_type=code, results in an Access Token being issued.
        if (AuthorizationGrantType.AUTHORIZATION_CODE.equals(
            userRequest.getClientRegistration().getAuthorizationGrantType())) {

            // Return true if there is at least one match between the authorized scope(s) and UserInfo scope(s)
            return CollectionUtils.containsAny(userRequest.getAccessToken().getScopes(), this.userInfoScopes);
        }

        return false;
    }

    /**
     * Extracts {@link GrantedAuthority GrantedAuthorities} from the AccessToken in
     * the {@link OidcUserRequest}.
     *
     * @param userRequest
     * @return
     */
    private Collection<? extends GrantedAuthority> extractKeycloakAuthorities(OidcUserRequest userRequest) {

        Jwt token = parseJwt(userRequest.getAccessToken().getTokenValue());

        // Would be great if Spring Security would provide something like a plugable
        // OidcUserRequestAuthoritiesExtractor interface to hide the junk below...

        @SuppressWarnings("unchecked")
        Map<String, Object> resourceMap = (Map<String, Object>) token.getClaims().get("resource_access");
        String clientId = userRequest.getClientRegistration().getClientId();

        @SuppressWarnings("unchecked")
        Map<String, Map<String, Object>> clientResource = (Map<String, Map<String, Object>>) resourceMap.get(clientId);
        if (CollectionUtils.isEmpty(clientResource)) {
            // do NOT return here as we want to use authoritiesMapper even if the list is empty
            clientResource = Collections.emptyMap();
        }

        @SuppressWarnings("unchecked")
        List<String> clientRoles = (List<String>) clientResource.get("roles");
        if (CollectionUtils.isEmpty(clientRoles)) {
            // do NOT return here as we want to use authoritiesMapper even if the list is empty
            clientRoles = Collections.emptyList();
        }

        Collection<? extends GrantedAuthority> authorities = AuthorityUtils
            .createAuthorityList(clientRoles.toArray(new String[0]));

        return authorities;
    }

    private Jwt parseJwt(String accessTokenValue) {
        try {
            // Token is already verified by spring security infrastructure
            return jwtDecoder.decode(accessTokenValue);
        } catch (JwtException e) {
            throw new OAuth2AuthenticationException(INVALID_REQUEST, e);
        }
    }
}

