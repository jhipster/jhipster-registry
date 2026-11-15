package tech.jhipster.registry.web.rest;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Set;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.registry.security.SecurityUtils;

@RestController
@RequestMapping("/api")
public class AccountResource {

    private static class AccountResourceException extends RuntimeException {}

    /**
     * {@code GET  /account} : get the current user.
     *
     * @return the current user.
     * @throws AccountResourceException {@code 500 (Internal Server Error)} if the user couldn't be returned.
     */
    @GetMapping("/account")
    public UserVM getAccount() {
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow(AccountResourceException::new);
        Set<String> authorities = SecurityUtils.getAuthorities();
        return new UserVM(login, authorities);
    }

    private static class UserVM {

        private String login;
        private Set<String> authorities;

        @JsonCreator
        UserVM(String login, Set<String> authorities) {
            this.login = login;
            this.authorities = authorities;
        }

        public boolean isActivated() {
            return true;
        }

        public Set<String> getAuthorities() {
            return authorities;
        }

        public String getLogin() {
            return login;
        }
    }
}
