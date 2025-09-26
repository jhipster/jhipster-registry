package tech.jhipster.registry.config;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import org.eclipse.jgit.transport.SshSessionFactory;
import org.eclipse.jgit.transport.sshd.DefaultProxyDataFactory;
import org.eclipse.jgit.transport.sshd.JGitKeyCache;
import org.eclipse.jgit.transport.sshd.KeyCache;
import org.eclipse.jgit.transport.sshd.SshdSessionFactory;
import org.eclipse.jgit.transport.sshd.SshdSessionFactoryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

/**
 * Configures JGit to use the Apache MINA based SSH implementation so modern key algorithms are supported.
 */
@Configuration
public class JGitSshConfiguration {

    private static final Logger log = LoggerFactory.getLogger(JGitSshConfiguration.class);

    private final KeyCache keyCache = new JGitKeyCache();

    @PostConstruct
    void configureSshClient() {
        SshSessionFactory currentFactory = SshSessionFactory.getInstance();
        if (currentFactory instanceof SshdSessionFactory) {
            log.debug("JGit already uses Apache MINA SSHD session factory");
            return;
        }

        SshdSessionFactory sshdSessionFactory = new SshdSessionFactoryBuilder()
            .setProxyDataFactory(new DefaultProxyDataFactory())
            .build(keyCache);

        SshSessionFactory.setInstance(sshdSessionFactory);
        log.info("Configured JGit to use Apache MINA SSHD for SSH connections");
    }

    @PreDestroy
    void shutdownSshClient() {
        keyCache.close();
    }
}
