package io.github.jhipster.registry.config;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.env.Environment;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class NotOauthAndUaaCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        Environment environment = context.getEnvironment();
        return !environment.acceptsProfiles(Constants.PROFILE_OAUTH2, Constants.PROFILE_UAA);
    }
}
