import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { ProfileService } from 'app/layouts/profiles/profile.service';
import { ApplicationsService } from 'app/registry/applications/applications.service';
import { RefreshService } from 'app/shared/refresh/refresh.service';
import { ConfigService } from './config.service';
import { ConfigComponent } from './config.component';

describe('Component Tests', () => {
  describe('ConfigComponent', () => {
    let comp: ConfigComponent;
    let fixture: ComponentFixture<ConfigComponent>;
    let service: ConfigService;
    let mockProfileService: ProfileService;
    let mockApplicationService: ApplicationsService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot()],
          declarations: [ConfigComponent],
          providers: [ConfigService, RefreshService],
        })
          .overrideTemplate(ConfigComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(ConfigComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ConfigService);
      mockProfileService = TestBed.inject(ProfileService);
      mockApplicationService = TestBed.inject(ApplicationsService);
    });

    describe('load', () => {
      it('should call load on init with profiles data', () => {
        // GIVEN
        jest.spyOn(mockProfileService, 'getProfileInfo').mockReturnValue(
          of({
            git: {},
            cloudConfigLabel: 'main',
            cloudConfigServerConfigurationSources: [
              {
                type: 'native',
                'search-locations': 'file:./central-config',
              },
            ],
            activeProfiles: ['composite', 'dev', 'api-docs'],
          })
        );

        jest.spyOn(service, 'getConfigSources').mockReturnValue(
          of({
            label: 'main',
            serverConfigurationSources: [
              {
                type: 'native',
                'search-locations': 'file:./central-config',
              },
            ],
          })
        );

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(mockProfileService.getProfileInfo).toHaveBeenCalled();
        expect(comp.activeRegistryProfiles).toEqual(['composite', 'dev', 'api-docs']);
        expect(comp.configurationSources).toEqual([
          {
            type: 'native',
            'search-locations': 'file:./central-config',
          },
        ]);
        expect(comp.isNative).toBeFalsy();
        expect(comp.label).toEqual('main');
      });
    });

    describe('refresh', () => {
      it('should call refresh on init with configAsJson', () => {
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
        jest.spyOn(service, 'getConfigAsJson').mockReturnValue(of(configAsJson));

        comp.ngOnInit();

        expect(service.getConfigAsJson).toHaveBeenCalledWith('application', 'prod', 'main');
        expect(comp.configAsJson).toEqual(configAsJson);
      });

      it('should call refresh on init with configAsProperties', () => {
        const configAsProperties: string =
          'configserver.name: JHipster Registry config server\n' +
          'configserver.status: Connected to the JHipster Registry config server!\n' +
          'jhipster.security.authentication.jwt.secret: my-secret-key-which-should-be-changed-in-production-and-be-base64-encoded\n' +
          'logging.path: /tmp\n' +
          'logging.file: ${spring.application.name}.log';
        jest.spyOn(service, 'getConfigAsProperties').mockReturnValue(of(configAsProperties));

        comp.ngOnInit();

        expect(service.getConfigAsProperties).toHaveBeenCalledWith('application', 'prod', 'main');
        expect(comp.configAsProperties).toEqual(configAsProperties);
      });

      it('should call refresh on init with configAsYaml', () => {
        // GIVEN
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
        jest.spyOn(service, 'getConfigAsYaml').mockReturnValue(of(configAsYaml));

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(service.getConfigAsYaml).toHaveBeenCalledWith('application', 'prod', 'main');
        expect(comp.configAsYaml).toEqual(configAsYaml);
      });

      it('should call refresh on init with Applications data', () => {
        jest.spyOn(mockApplicationService, 'findAll').mockReturnValue(
          of([
            {
              name: 'app1',
              instances: [
                {
                  instanceId: 'app1:9p2qwuxo61ockvplncso3hzh72nonh',
                  status: 'UP',
                },
                {
                  instanceId: 'app1:jsgfimaqac5u2gnggy33jsoyfbrb4u',
                  status: 'UP',
                },
              ],
            },
            {
              name: 'app2',
              instances: [
                {
                  instanceId: 'app2:bb47hzj0a6bzcs27gxqgp3unnrky4n',
                  status: 'UP',
                },
              ],
            },
          ])
        );

        comp.ngOnInit();

        expect(mockApplicationService.findAll).toHaveBeenCalled();
        expect(comp.applications.length).toEqual(3);
        expect(comp.applications).toEqual(['application', 'app1', 'app2']);
      });
    });
  });
});
