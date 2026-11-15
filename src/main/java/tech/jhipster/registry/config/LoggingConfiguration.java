package tech.jhipster.registry.config;

import static tech.jhipster.config.logging.LoggingUtils.*;

import ch.qos.logback.classic.LoggerContext;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Configuration;
import tech.jhipster.config.JHipsterProperties;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

/*
 * Configures the console and Logstash log appenders from the app properties
 */
@Configuration
@RefreshScope
public class LoggingConfiguration {

    public LoggingConfiguration(
        @Value("${spring.application.name}") String appName,
        @Value("${server.port}") String serverPort,
        JHipsterProperties jHipsterProperties,
        ObjectMapper mapper
    ) throws JacksonException {
        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();

        Map<String, String> map = new HashMap<>();
        map.put("app_name", appName);
        map.put("app_port", serverPort);
        var customFields = mapper.writeValueAsString(map);

        var loggingProperties = jHipsterProperties.getLogging();
        var logstashProperties = loggingProperties.getLogstash();

        if (loggingProperties.isUseJsonFormat()) {
            addJsonConsoleAppender(context, customFields);
        }
        if (logstashProperties.isEnabled()) {
            addLogstashTcpSocketAppender(context, customFields, logstashProperties);
        }
        if (loggingProperties.isUseJsonFormat() || logstashProperties.isEnabled()) {
            addContextListener(context, customFields, loggingProperties);
        }
    }
}
