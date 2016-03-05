FROM alpine:3.3

ENV JAVA_HOME=/usr/lib/jvm/default-jvm
RUN apk add --no-cache openjdk8 && \
    ln -sf "${JAVA_HOME}/bin/" "/usr/bin/"

# add jhipster-registry source
ENV SPRING_PROFILES=prod
ADD pom.xml mvnw /code/
ADD src /code/src
ADD .mvn /code/.mvn
RUN chmod +x /code/mvnw

# package the application and delete all lib
RUN cd /code/ && \
    ./mvnw package && \
    mv /code/target/*.war /jhipster-registry.war && \
    rm -Rf /root/.m2/wrapper/ && \
    rm -Rf /root/.m2/repository/

RUN sh -c 'touch /jhipster-registry.war'
EXPOSE 8761
VOLUME /tmp
CMD ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/jhipster-registry.war","--spring.profiles.active=${SPRING_PROFILES}"]
