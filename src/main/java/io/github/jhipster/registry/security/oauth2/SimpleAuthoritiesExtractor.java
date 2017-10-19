package io.github.jhipster.registry.security.oauth2;

import static java.util.stream.Collectors.toList;

import java.util.*;

import org.springframework.boot.autoconfigure.security.oauth2.resource.AuthoritiesExtractor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import io.github.jhipster.registry.security.AuthoritiesConstants;

public class SimpleAuthoritiesExtractor implements AuthoritiesExtractor {

    private final String oauth2AuthoritiesAttribute;

    public SimpleAuthoritiesExtractor(String oauth2AuthoritiesAttribute) {
        this.oauth2AuthoritiesAttribute = oauth2AuthoritiesAttribute;
    }

    @Override
    public List<GrantedAuthority> extractAuthorities(Map<String, Object> map) {
        return Optional.ofNullable((List<String>) map.get(oauth2AuthoritiesAttribute))
            .filter(it -> !it.isEmpty())
            .orElse(Collections.singletonList(AuthoritiesConstants.USER))
            .stream()
            .map(role -> new SimpleGrantedAuthority(role))
            .collect(toList());
    }
}
