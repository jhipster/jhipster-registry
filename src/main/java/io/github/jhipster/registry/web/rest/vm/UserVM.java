package io.github.jhipster.registry.web.rest.vm;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

/**
 * View Model object for representing a user, with his authorities.
 */
public final class UserVM {

    private final String login;

    private final Set<String> authorities;

    private final String redirect;

    public static UserVM createUser(String login, Set<String> authorities) {
        return new UserVM(login, authorities, null);
    }

    public static UserVM createRedirect(String redirect) {
        return new UserVM(null, null, redirect);
    }

    private UserVM(String login, Set<String> authorities, String redirect) {
        if ((redirect != null && login != null) || (login != null && authorities == null)) {
            throw new IllegalArgumentException();
        }
        this.login = login;
        this.authorities = authorities;
        this.redirect = redirect;
    }

    public String getLogin() {
        return login;
    }

    public Set<String> getAuthorities() {
        return authorities;
    }

    public String getRedirect() {
        return redirect;
    }

    @Override
    public String toString() {
        return "UserVM{" +
            "login='" + login + '\'' +
            ", authorities=" + authorities +
            ", redirect=" + redirect +
            "}";
    }
}
