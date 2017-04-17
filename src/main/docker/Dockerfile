FROM openjdk:8-jdk-alpine

# add directly the war
COPY *.war /jhipster-registry.war

EXPOSE 8761

ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    SPRING_PROFILES_ACTIVE=prod,native

CMD ["java","-jar","/jhipster-registry.war"]
