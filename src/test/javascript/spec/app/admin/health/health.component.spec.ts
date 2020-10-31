import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { JHipsterRegistryTestModule } from '../../../test.module';
import { HealthComponent } from 'app/admin/health/health.component';
import { Health, HealthService } from 'app/admin/health/health.service';

describe('Component Tests', () => {
  describe('HealthCheckComponent', () => {
    let comp: HealthComponent;
    let fixture: ComponentFixture<HealthComponent>;
    let service: HealthService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [HealthComponent],
      })
        .overrideTemplate(HealthComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HealthComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(HealthService);
    });

    describe('getBadgeClass', () => {
      it('should get badge class', () => {
        const upBadgeClass = comp.getBadgeClass('UP');
        const downBadgeClass = comp.getBadgeClass('DOWN');
        expect(upBadgeClass).toEqual('badge-success');
        expect(downBadgeClass).toEqual('badge-danger');
      });
    });

    describe('refresh', () => {
      it('Should handle response on refreshing health data', () => {
        // GIVEN
        comp.activeRoute = {
          path: 'pathApp1',
          prefix: 'prefixApp1',
          appName: 'appName1',
          status: 'UP',
          serviceId: '1',
        };
        const health: Health = { status: 'UP', components: { mail: { status: 'UP', details: 'mailDetails' } } };
        spyOn(service, 'checkInstanceHealth').and.returnValue(of(health));

        // WHEN
        comp.refreshActiveRouteHealth();

        // THEN
        expect(service.checkInstanceHealth).toHaveBeenCalled();
        expect(comp.health).toEqual(health);
      });

      it('should handle a 503 on refreshing health data', () => {
        // GIVEN
        comp.activeRoute = {
          path: 'pathApp1',
          prefix: 'prefixApp1',
          appName: 'appName1',
          status: 'UP',
          serviceId: '1',
        };
        const health: Health = { status: 'DOWN', components: { mail: { status: 'DOWN', details: 'mailDetails' } } };
        spyOn(service, 'checkInstanceHealth').and.returnValue(throwError(new HttpErrorResponse({ status: 503, error: health })));

        // WHEN
        comp.refreshActiveRouteHealth();

        // THEN
        expect(service.checkInstanceHealth).toHaveBeenCalled();
        expect(comp.health).toEqual(health);
      });
    });
  });
});
