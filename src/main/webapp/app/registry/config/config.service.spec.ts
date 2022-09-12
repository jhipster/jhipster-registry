import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Config, ConfigService } from './config.service';

describe('Service Tests', () => {
  describe('Config Service', () => {
    let service: ConfigService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });

      service = TestBed.inject(ConfigService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should get Config as Json', () => {
        let expectedResult: string | null = null;
        const configAsJson: string =
          '{\n' +
          '  configserver: {\n' +
          "    name: 'JHipster Registry config server',\n" +
          "    status: 'Connected to the JHipster Registry config server!'\n" +
          '  },\n' +
          '  jhipster: {\n' +
          '    security: {\n' +
          '      authentication: {\n' +
          '        jwt: {\n' +
          "          secret: 'my-secret-key-which-should-be-changed-in-production-and-be-base64-encoded'\n" +
          '        }\n' +
          '      }\n' +
          '    }\n' +
          '  },\n' +
          '  logging: {\n' +
          "    path: '/tmp',\n" +
          "    file: '${spring.application.name}.log'\n" +
          '  }\n' +
          '}';
        service.getConfigAsJson('application', 'prod', 'main').subscribe(received => (expectedResult = received));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(configAsJson);
        expect(expectedResult).toEqual(configAsJson);
      });

      it('should get Config as Properties', () => {
        let expectedResult: string | null = null;
        const configAsProperties: string =
          'configserver.name: JHipster Registry config server\n' +
          'configserver.status: Connected to the JHipster Registry config server!\n' +
          'jhipster.security.authentication.jwt.secret: my-secret-key-which-should-be-changed-in-production-and-be-base64-encoded\n' +
          'logging.path: /tmp\n' +
          'logging.file: ${spring.application.name}.log';
        service.getConfigAsProperties('application', 'prod', 'main').subscribe(received => (expectedResult = received));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(configAsProperties);
        expect(expectedResult).toEqual(configAsProperties);
      });

      it('should get Config as Yaml', () => {
        let expectedResult: string | null = null;
        const configAsYaml: string =
          'configserver:\n' +
          '  name: JHipster Registry config server\n' +
          '  status: Connected to the JHipster Registry config server!\n' +
          'jhipster:\n' +
          '  security:\n' +
          '    authentication:\n' +
          '      jwt:\n' +
          '        secret: my-secret-key-which-should-be-changed-in-production-and-be-base64-encoded\n' +
          'logging:\n' +
          '  path: /tmp\n' +
          '  file: ${spring.application.name}.log';
        service.getConfigAsYaml('application', 'prod', 'main').subscribe(received => (expectedResult = received));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(configAsYaml);
        expect(expectedResult).toEqual(configAsYaml);
      });

      it('should get Config Sources', () => {
        let expectedResult: Config | null = null;
        const configSources: Config = {
          label: 'main',
          serverConfigurationSources: [
            {
              type: 'native',
              'search-locations': 'file:./central-config',
            },
          ],
        };

        service.getConfigSources().subscribe(received => (expectedResult = received));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(configSources);
        expect(expectedResult).toEqual(configSources);
      });
    });
  });
});
