import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';

import { JHipsterRegistryTestModule } from '../../../test.module';
import { ConfigurationComponent } from 'app/admin/configuration/configuration.component';
import { Bean, ConfigurationService, PropertySource } from 'app/admin/configuration/configuration.service';

describe('Component Tests', () => {
  describe('ConfigurationComponent', () => {
    let comp: ConfigurationComponent;
    let fixture: ComponentFixture<ConfigurationComponent>;
    let service: ConfigurationService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [ConfigurationComponent],
        providers: [ConfigurationService]
      })
        .overrideTemplate(ConfigurationComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ConfigurationComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ConfigurationService);
    });

    describe('OnInit', () => {
      it('should set all default values correctly', () => {
        expect(comp.propertySources).toEqual([]);
        expect(comp.beansFilter).toBe('');
        expect(comp.beansAscending).toBe(true);
      });

      it('Should call refresh on route changed', () => {
        // GIVEN
        comp.activeRoute = {
          path: 'pathApp1',
          prefix: 'prefixApp1',
          appName: 'appName1',
          status: 'UP',
          serviceId: '1'
        };
        const beans: Bean[] = [
          {
            prefix: 'jhipster',
            properties: {
              clientApp: {
                name: 'jhipsterApp'
              }
            }
          }
        ];
        const propertySources: PropertySource[] = [
          {
            name: 'server.ports',
            properties: {
              'local.server.port': {
                value: '8080'
              }
            }
          }
        ];
        spyOn(service, 'getInstanceBeans').and.returnValue(of(beans));
        spyOn(service, 'getInstancePropertySources').and.returnValue(of(propertySources));

        // WHEN
        comp.refreshActiveRouteBeans();

        // THEN
        expect(service.getInstanceBeans).toHaveBeenCalled();
        expect(service.getInstancePropertySources).toHaveBeenCalled();
        expect(comp.allBeans).toEqual(beans);
        expect(comp.beans).toEqual(beans);
        expect(comp.propertySources).toEqual(propertySources);
      });
    });
  });
});
