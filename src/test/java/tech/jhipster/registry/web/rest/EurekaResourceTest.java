package tech.jhipster.registry.web.rest;

import static org.assertj.core.api.Assertions.assertThat;

import com.netflix.discovery.shared.Pair;
import java.util.List;
import org.junit.jupiter.api.Test;

class EurekaResourceTest {

    @Test
    void shouldIndexLeasesByTimestamp() {
        var leases = List.of(new Pair<>(1L, "APP(app:1)"), new Pair<>(2L, "APP(app:2)"));

        assertThat(EurekaResource.toHistory(leases)).containsEntry(1L, "APP(app:1)").containsEntry(2L, "APP(app:2)").hasSize(2);
    }

    @Test
    void shouldKeepLeasesThatShareATimestamp() {
        var leases = List.of(new Pair<>(1L, "APP(app:1)"), new Pair<>(1L, "APP(app:2)"));

        assertThat(EurekaResource.toHistory(leases)).containsEntry(1L, "APP(app:1), APP(app:2)").hasSize(1);
    }
}
