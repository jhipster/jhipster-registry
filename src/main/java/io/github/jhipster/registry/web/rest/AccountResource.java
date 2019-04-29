package io.github.jhipster.registry.web.rest;

import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
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

    /**
     * GET  /authenticate : check if the user is authenticated, and return its login.
     *
     * @param request the HTTP request
     * @return the login if the user is authenticated
     */
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
     */
    @GetMapping("/account")
    public ResponseEntity<UserVM> getAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        try {
            String login;
            if (authentication.getPrincipal() instanceof User) {
                User user = (User) authentication.getPrincipal();
                login = user.getUsername();
                log.debug("The username `{}` has been found using JWT", login);
            } else if (authentication.getPrincipal() instanceof String) {
                login = (String) authentication.getPrincipal();
            } else if (authentication instanceof OAuth2AuthenticationToken) {
                login = ((OAuth2AuthenticationToken) authentication).getPrincipal().getName();
                log.debug("The username `{}` has been found using OpenID Connect", login);
            } else {
                log.debug("The username could not be found");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
            UserVM userVM = new UserVM(login,
                authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority).collect(Collectors.toSet()));
            return new ResponseEntity<>(userVM, HttpStatus.OK);
        } catch (NullPointerException | ClassCastException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
