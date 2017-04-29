FROM openjdk:8

# Add jhipster-registry source
ADD . /code/

# Package the application and delete all lib
RUN \
    cd /code/ && \
    rm -Rf target node_modules && \
    chmod +x /code/mvnw && \
    sleep 1 && \
    ./mvnw package -Pprod -DskipTests && \
    mv /code/target/*.war /jhipster-registry.war && \
    rm -Rf /code/ /root/.m2 /root/.cache /tmp/*

EXPOSE 8761

ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    SPRING_PROFILES_ACTIVE=prod,native \
    GIT_URI=https://github.com/jhipster/jhipster-registry/ \
    GIT_SEARCH_PATHS=central-config

CMD ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/jhipster-registry.war","--spring.cloud.config.server.git.uri=${GIT_URI}","--spring.cloud.config.server.git.search-paths=${GIT_SEARCH_PATHS}"]
