package io.github.jhipster.registry;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.core.env.Environment;

@SpringBootApplication
@EnableEurekaServer
public class JHipsterRegistry {

    private static final Logger log = LoggerFactory.getLogger(JHipsterRegistry.class);

    public static void main(String[] args) throws UnknownHostException {
        Environment env = SpringApplication.run(JHipsterRegistry.class, args).getEnvironment();
        log.info("Access URLs:\n----------------------------------------------------------\n\t" +
                "Local: \t\thttp://127.0.0.1:{}\n\t" +
                "External: \thttp://{}:{}\n----------------------------------------------------------",
            env.getProperty("server.port"),
            InetAddress.getLocalHost().getHostAddress(),
            env.getProperty("server.port"));
    }
}
