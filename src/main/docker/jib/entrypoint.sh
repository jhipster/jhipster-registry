#!/bin/sh

echo "JHipster Registry will start in ${JHIPSTER_SLEEP}s..." && sleep ${JHIPSTER_SLEEP}
set -x
exec java ${JAVA_OPTS} -noverify -XX:+AlwaysPreTouch -Djava.security.egd=file:/dev/./urandom -cp /app/resources/:/app/classes/:/app/libs/* "tech.jhipster.registry.JHipsterRegistryApp" "$@"
