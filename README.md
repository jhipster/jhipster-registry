# JHipster Registry

[![Build Status][travis-image]][travis-url]  [![Docker Pulls](https://img.shields.io/docker/pulls/jhipster/jhipster-registry.svg)](https://hub.docker.com/r/jhipster/jhipster-registry/)

This is the [JHipster](https://www.jhipster.tech/) registry service, based on [Spring Cloud Netflix](http://cloud.spring.io/spring-cloud-netflix/), [Eureka](https://github.com/Netflix/eureka) and [Spring Cloud Config](http://cloud.spring.io/spring-cloud-config/).

Full documentation is available on the [JHipster documentation for microservices](https://www.jhipster.tech/microservices-architecture).

## Deploy to Heroku

Click this button to deploy your own instance of the registry:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

There are a few limitations when deploying to Heroku.

* The registry will only work with [native configuration](https://www.jhipster.tech/jhipster-registry/#spring-cloud-config) (and not Git config).
* The registry service cannot be scaled up to multiple dynos to provide redundancy. You must deploy multiple applications (i.e. click the button more than once). This is because Eureka requires distinct URLs to synchronize in-memory state between instances.

## Running locally

To run the cloned repository;
* For development run for example:

    - `./mvnw -Pdev,eureka,configserver,proxy` for an embedded Eureka server and Spring Cloud config server and proxy to access microservice APIs.
    - `./mvnw -Pdev,consuldiscovery,consulconfig,proxy` to use Consul discovery and configuration.
    - `./mvnw -Pdev,kubernetes,proxy` to use Kubernetes discovery and configuration.

* Run `yarn && yarn start` for hot reload of client side code.

## Available profiles

### Security (choose one or don't set any for JWT)

- `oauth2`: authentication with an OAuth2 provider
- `uaa` :  authentication with a JHipster UAA

### Discovery (choose one)

- `eureka`: service discovery with the Eureka registry (start an embedded Eureka server)
- `consuldiscovery`: service discovery with Consul (requires a Consul server)
- `kubernetes`: service discovery with Kubernetes (works only in Kubernetes)

### Configuration ()

- `configserver`: centralized configuration with Spring Cloud Config (start an embedded Spring Cloud Config server)
- `consulconfig`: centralized configuration based on the Consul KV store (requires a Consul server)
- `kubernetes`: centralized configuration based on the Kuberentes Configmaps store (works only in Kubernetes)

### Others

- `proxy`: enable the embedded Zuul proxy (to access microservices endpoints)

[travis-image]: https://travis-ci.org/jhipster/jhipster-registry.svg?branch=master
[travis-url]: https://travis-ci.org/jhipster/jhipster-registry
