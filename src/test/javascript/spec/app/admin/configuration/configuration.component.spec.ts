import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';

import { JHipsterRegistryTestModule } from '../../../test.module';
import { JhiConfigurationComponent } from 'app/admin/configuration/configuration.component';
import { JhiConfigurationService } from 'app/admin/configuration/configuration.service';

describe('Component Tests', () => {
  describe('JhiConfigurationComponent', () => {
    let comp: JhiConfigurationComponent;
    let fixture: ComponentFixture<JhiConfigurationComponent>;
    let service: JhiConfigurationService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [JhiConfigurationComponent],
        providers: [JhiConfigurationService]
      })
        .overrideTemplate(JhiConfigurationComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(JhiConfigurationComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(JhiConfigurationService);
    });

    describe('OnInit', () => {
      it('should set all default values correctly', () => {
        expect(comp.configKeys).toEqual([]);
        expect(comp.filter).toBe('');
        expect(comp.orderProp).toBe('prefix');
        expect(comp.reverse).toBe(false);
      });
      it('Should refresh config data', () => {
        // GIVEN
        comp.activeRoute = {
          path: 'pathApp1',
          prefix: 'prefixApp1',
          appName: 'appName1',
          status: 'UP',
          serviceId: '1',
          serviceInstances: []
        };
        const body = [{ config: 'test', properties: 'test' }, { config: 'test2' }];
        const envConfig = { envConfig: 'test' };
        spyOn(service, 'getConfigs').and.returnValue(of(body));
        spyOn(service, 'getEnv').and.returnValue(of(envConfig));

        // WHEN
        comp.refreshActiveRouteConfig();

        // THEN
        expect(service.getConfigs).toHaveBeenCalled();
        expect(service.getEnv).toHaveBeenCalled();
        expect(comp.configKeys).toEqual([['0', '1', '2', '3']]);
        expect(comp.allConfiguration).toEqual(envConfig);
      });
    });
    describe('keys method', () => {
      it('should return the keys of an Object', () => {
        // GIVEN
        const data = {
          key1: 'test',
          key2: 'test2'
        };

        // THEN
        expect(comp.keys(data)).toEqual(['key1', 'key2']);
        expect(comp.keys(undefined)).toEqual([]);
      });
    });
  });
});
