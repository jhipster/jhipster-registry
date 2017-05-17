# Centralized logging and metrics monitoring with ELK

The ELK stack is composed of :
- [Elasticsearch][] for indexing the logs
- [Logstash][] to manage and process the logs
- [Kibana][] to visualize the logs with a nice interface

### Configure your applications

To configure a JHipster app to forward their logs to ELK, enable logstash logging in their application-dev.yml or application-prod.yml

    jhipster:
        logging:
            logstash:
                enabled: true
                host: localhost
                port: 5000
                queueSize: 512

This setup is recommended for a production environment where centralizing logs is very interesting.

To configure metrics monitoring, enable metrics log reporting in your JHipster apps.

    jhipster:
        logs:
            enabled: false
            reportFrequency: 60 # seconds
            q 
### Start ELK with docker

To start ELK :

    docker-compose -f elk.yml up -d

You can now access Kibana at http://localhost:5601
It should automatically receive logs from your applications.

To stop ELK :

    docker-compose -f elk.yml stop

### Logstash configuration

Logstash is configured to listen to syslog messages on UDP port 5000 and forward them to an Elasticsearch instance on it's default port 9200. 
You can change this behaviour or add inputs and filters for other log formats in `logstash/logstash.conf`.

### Additional data added to the logs

In order to trace the origin of logs, before being forwarded to logstash, those are enriched with:
- the app name (_spring.application.name_)
- their port (_server.port_)
- their eureka instance ID (_eureka.instance.instanceId_)

### Install Kibana plugins

To install Kibana plugins, first start your containers as explained before and then do the following:

Log into your application:

    docker exec -it elk-kibana /bin/bash

Install the plugins you want:

    kibana plugin --install elastic/timelion

Exit and restart the Kibana container:

    exit
    docker-compose -f elk.yml restart elk-kibana

[JHipster]: https://jhipster.github.io/
[Elasticsearch]: https://www.elastic.co/products/elasticsearch
[Logstash]: https://www.elastic.co/products/logstash
[Kibana]: https://www.elastic.co/products/kibana

