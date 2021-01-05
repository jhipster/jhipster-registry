package io.github.jhipster.registry.web.rest.vm;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

/**
 * View Model object for representing a user, with his authorities.
 */
public class UserVM {

    @NotNull
    @Size(min = 1, max = 50)
    private String login;

    private Set<String> authorities;

    public UserVM() {
    }

    public UserVM(String login, Set<String> authorities) {

        this.login = login;
        this.authorities = authorities;
    }

    public String getLogin() {
        return login;
    }

    public Set<String> getAuthorities() {
        return authorities;
    }

    @Override
    public String toString() {
        return "UserVM{" +
            "login='" + login + '\'' +
            ", authorities=" + authorities +
            "}";
    }
}
