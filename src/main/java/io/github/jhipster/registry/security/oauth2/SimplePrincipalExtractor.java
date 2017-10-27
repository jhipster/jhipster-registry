package io.github.jhipster.registry.security.oauth2;

import java.util.Map;

import org.springframework.boot.autoconfigure.security.oauth2.resource.PrincipalExtractor;

public class SimplePrincipalExtractor implements PrincipalExtractor {

    private final String oauth2PrincipalAttribute;

    public SimplePrincipalExtractor(String oauth2PrincipalAttribute) {
        this.oauth2PrincipalAttribute = oauth2PrincipalAttribute;
    }

    @Override
    public Object extractPrincipal(Map<String, Object> map) {
        return map.getOrDefault(oauth2PrincipalAttribute, "unknown");
    }
}
