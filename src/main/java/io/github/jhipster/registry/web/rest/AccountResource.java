package io.github.jhipster.registry.web.rest;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;

import io.github.jhipster.registry.security.AuthoritiesConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationManager;
import org.springframework.security.oauth2.server.resource.BearerTokenAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.User;

import io.github.jhipster.registry.web.rest.vm.UserVM;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AccountResource {

    private final Logger log = LoggerFactory.getLogger(AccountResource.class);

    private static final String AUTH = "/protocol/openid-connect/auth";

    @Value("${spring.security.oauth2.client.provider.oidc.issuer-uri}")
    private String issuerUri;

    @Value("${spring.security.oauth2.client.registration.oidc.client-id}")
    private String clientId;

    @Autowired
    private OAuth2AuthenticationManager authenticationManager;

    @Autowired
    private OAuth2ClientContext clientContext;

    /**
     * GET  /authenticate : check if the user is authenticated, and return its login.
     *
     * @param request the HTTP request
     * @return the login if the user is authenticated
     */
    @Secured({"ROLE_ADMIN"})
    @GetMapping("/authenticate")
    public String isAuthenticated(HttpServletRequest request) {
        log.debug("REST request to check if the current user is authenticated");
        return request.getRemoteUser();
    }

    /**
     * GET  /account : get the current user.
     *
     * @return the ResponseEntity with status 200 (OK) and the current user in body, or status 500 (Internal Server
     * Error) if the user couldn't be returned
     *
     * Hint: Do NOT consider to @Secured this end-point.
     */
    @GetMapping("/account")
    public ResponseEntity<UserVM> getAccount(HttpServletRequest request) {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        Set<String> authorities = new HashSet<>();
        authentication.getAuthorities().forEach(ga -> authorities.add(ga.getAuthority()));
        if (!authorities.contains(AuthoritiesConstants.ADMIN)) {
            String uri = request.getRequestURL().toString();
            uri = uri.substring(0, uri.indexOf("/api/account"));

            StringBuilder redirect = new StringBuilder(issuerUri).append(AUTH)
                .append("?client_id=").append(clientId)
                .append("&response_type=code")
                .append("&redirect_uri=").append(uri);

            String redirectUrl = redirect.toString();
            log.info("redirect url: " + redirectUrl);
            UserVM userVM = UserVM.createRedirect(redirectUrl);
            // TODO: should be HttpStatus.UNAUTHORIZED but angular client is not prepared to handle this
            return new ResponseEntity<>(userVM, HttpStatus.OK);
        }
        try {
            String login;
            if (authentication.getPrincipal() instanceof User) {
                User user = (User) authentication.getPrincipal();
                login = user.getUsername();
                log.debug("The username `{}` has been found using JWT", login);
            } else if (authentication instanceof OAuth2AuthenticationToken) {
                login = ((OAuth2AuthenticationToken) authentication).getPrincipal().getName();
                log.debug("The username `{}` has been found using OpenID Connect Token", login);
            } else if (authentication instanceof OAuth2Authentication) {
                login = authentication.getPrincipal().toString();
                log.debug("The username `{}` has been found using OpenID Connect", login);
            } else {
                log.debug("The username could not be found");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
            UserVM userVM = UserVM.createUser(login,
                authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet()));
            return new ResponseEntity<>(userVM, HttpStatus.OK);
        } catch (NullPointerException | ClassCastException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
