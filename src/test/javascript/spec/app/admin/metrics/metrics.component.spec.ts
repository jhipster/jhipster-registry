import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';

import { JHipsterRegistryTestModule } from '../../../test.module';
import { MetricsComponent } from 'app/admin/metrics/metrics.component';
import { MetricsService } from 'app/admin/metrics/metrics.service';

describe('Component Tests', () => {
  describe('MetricsMonitoringComponent', () => {
    let comp: MetricsComponent;
    let fixture: ComponentFixture<MetricsComponent>;
    let service: MetricsService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [MetricsComponent],
      })
        .overrideTemplate(MetricsComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(MetricsComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MetricsService);
    });

    describe('refresh', () => {
      it('Should handle response on refreshing metrics data', () => {
        // GIVEN
        const response = {
          timers: {
            service: 'test',
            unrelatedKey: 'test',
          },
          gauges: {
            'jcache.statistics': {
              value: 2,
            },
            unrelatedKey: 'test',
          },
        };
        comp.activeRoute = {
          path: 'pathApp1',
          prefix: 'prefixApp1',
          appName: 'appName1',
          status: 'UP',
          serviceId: '1',
        };
        spyOn(service, 'getInstanceMetrics').and.returnValue(of(response));

        // WHEN
        comp.refreshActiveRouteMetrics();

        // THEN
        expect(service.getInstanceMetrics).toHaveBeenCalled();
      });
    });
  });
});
