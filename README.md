# JHipster Registry

[![Build Status][github-actions-build]][github-actions-url] [![Docker Status][github-actions-docker]][github-actions-url] [![Docker Pulls](https://img.shields.io/docker/pulls/jhipster/jhipster-registry.svg)](https://hub.docker.com/r/jhipster/jhipster-registry/)

This is the [JHipster](https://www.jhipster.tech/) registry service, based on [Spring Cloud Netflix](https://cloud.spring.io/spring-cloud-netflix/), [Eureka](https://github.com/Netflix/eureka) and [Spring Cloud Config](https://cloud.spring.io/spring-cloud-config/).

Full documentation is available on the [JHipster documentation for microservices](https://www.jhipster.tech/microservices-architecture).

## Deploy to Heroku

Click this button to deploy your own instance of the registry:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

There are a few limitations when deploying to Heroku.

- The registry will only work with [native configuration](https://www.jhipster.tech/jhipster-registry/#spring-cloud-config) (and not Git config).
- The registry service cannot be scaled up to multiple dynos to provide redundancy. You must deploy multiple applications (i.e. click the button more than once). This is because Eureka requires distinct URLs to synchronize in-memory state between instances.

## Running locally

To run the cloned repository;

- For development run `./mvnw -Pdev,webpack` to just start in development or run `./mvnw` and run `npm install && npm start` for hot reload of client side code.
- For production profile run `./mvnw -Pprod`

[github-actions-build]: https://github.com/jhipster/jhipster-registry/workflows/Build/badge.svg
[github-actions-docker]: https://github.com/jhipster/jhipster-registry/workflows/Docker%20Image/badge.svg
[github-actions-url]: https://github.com/jhipster/jhipster-registry/actions
