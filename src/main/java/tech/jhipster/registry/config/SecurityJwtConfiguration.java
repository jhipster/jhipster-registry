package tech.jhipster.registry.config;

import static tech.jhipster.registry.security.SecurityUtils.JWT_ALGORITHM;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;
import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.util.StringUtils;
import tech.jhipster.registry.management.SecurityMetersService;

@Configuration
@Profile("!" + Constants.PROFILE_OAUTH2)
public class SecurityJwtConfiguration {

    private static final Logger LOG = LoggerFactory.getLogger(SecurityJwtConfiguration.class);

    @Value("${jhipster.security.authentication.jwt.base64-secret:}")
    private String base64Secret;

    // Read only when base64-secret is not set, for configuration repositories written for older releases
    @Value("${jhipster.security.authentication.jwt.secret:}")
    private String secret;

    @Bean
    public JwtDecoder jwtDecoder(SecurityMetersService metersService) {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getSecretKey()).macAlgorithm(JWT_ALGORITHM).build();
        return token -> {
            try {
                return jwtDecoder.decode(token);
            } catch (Exception e) {
                if (e.getMessage().contains("Invalid signature")) {
                    metersService.trackTokenInvalidSignature();
                } else if (e.getMessage().contains("Jwt expired at")) {
                    metersService.trackTokenExpired();
                } else if (
                    e.getMessage().contains("Invalid JWT serialization") ||
                    e.getMessage().contains("Malformed token") ||
                    e.getMessage().contains("Invalid unsecured/JWS/JWE")
                ) {
                    metersService.trackTokenMalformed();
                } else {
                    LOG.error("Unknown JWT error {}", e.getMessage());
                }
                throw e;
            }
        };
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes;
        if (StringUtils.hasText(base64Secret)) {
            keyBytes = Base64.from(base64Secret).decode();
        } else if (StringUtils.hasText(secret)) {
            LOG.warn(
                "The JWT secret is not Base64-encoded. " +
                    "Set `jhipster.security.authentication.jwt.base64-secret` instead of `jhipster.security.authentication.jwt.secret`."
            );
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        } else {
            throw new IllegalStateException(
                "No JWT secret is configured. Set `jhipster.security.authentication.jwt.base64-secret`, " +
                    "for example in the configuration the registry reads from its config server."
            );
        }
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALGORITHM.getName());
    }
}
