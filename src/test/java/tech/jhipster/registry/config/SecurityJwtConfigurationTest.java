package tech.jhipster.registry.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static tech.jhipster.registry.security.SecurityUtils.JWT_ALGORITHM;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.test.util.ReflectionTestUtils;
import tech.jhipster.registry.management.SecurityMetersService;

class SecurityJwtConfigurationTest {

    private static final String SECRET = "my-secret-key-which-should-be-changed-in-production-and-be-base64-encoded";

    @Test
    void shouldSignAndVerifyWithTheBase64Secret() {
        SecurityJwtConfiguration configuration = configuration(Base64.getEncoder().encodeToString(SECRET.getBytes(StandardCharsets.UTF_8)), "");

        assertThat(decode(configuration, encode(configuration))).isEqualTo("admin");
    }

    @Test
    void shouldFallBackToThePlainSecretOfOlderConfigurationRepositories() {
        SecurityJwtConfiguration configuration = configuration("", SECRET);

        assertThat(decode(configuration, encode(configuration))).isEqualTo("admin");
    }

    @Test
    void shouldPreferTheBase64SecretWhenBothAreSet() {
        SecurityJwtConfiguration both = configuration(Base64.getEncoder().encodeToString("x".repeat(64).getBytes(StandardCharsets.UTF_8)), SECRET);
        SecurityJwtConfiguration plainOnly = configuration("", SECRET);

        String token = encode(both);

        assertThatThrownBy(() -> decode(plainOnly, token)).isInstanceOf(JwtException.class);
    }

    @Test
    void shouldExplainThatASecretIsRequired() {
        SecurityJwtConfiguration configuration = configuration("", "");

        assertThatThrownBy(configuration::jwtEncoder)
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("jhipster.security.authentication.jwt.base64-secret");
    }

    private static SecurityJwtConfiguration configuration(String base64Secret, String secret) {
        SecurityJwtConfiguration configuration = new SecurityJwtConfiguration();
        ReflectionTestUtils.setField(configuration, "base64Secret", base64Secret);
        ReflectionTestUtils.setField(configuration, "secret", secret);
        return configuration;
    }

    private static String encode(SecurityJwtConfiguration configuration) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder().subject("admin").issuedAt(now).expiresAt(now.plusSeconds(60)).build();
        return configuration.jwtEncoder().encode(JwtEncoderParameters.from(JwsHeader.with(JWT_ALGORITHM).build(), claims)).getTokenValue();
    }

    private static String decode(SecurityJwtConfiguration configuration, String token) {
        return configuration.jwtDecoder(mock(SecurityMetersService.class)).decode(token).getSubject();
    }
}
