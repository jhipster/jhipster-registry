FROM openjdk:8 as builder
ADD . /code/
RUN \
    apt-get update && \
    apt-get install build-essential -y && \
    cd /code/ && \
    rm -Rf target node_modules && \
    chmod +x /code/mvnw && \
    sleep 1 && \
    JHI_DISABLE_WEBPACK_LOGS=true ./mvnw package -ntp -Pprod -DskipTests && \
    mv /code/target/*.jar /jhipster-registry.jar && \
    apt-get clean && \
    rm -Rf /code/ /root/.m2 /root/.cache /tmp/* /var/lib/apt/lists/* /var/tmp/*

FROM openjdk:8-jre-alpine
ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    JAVA_OPTS="" \
    SPRING_PROFILES_ACTIVE=prod
EXPOSE 8761
RUN apk add --no-cache curl && \
    mkdir /target && \
    chmod g+rwx /target
CMD java \
        ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom \
        -jar /jhipster-registry.jar

COPY --from=builder /jhipster-registry.jar .
