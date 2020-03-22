import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';

import { JHipsterRegistryTestModule } from '../../../test.module';
import { MetricsMonitoringComponent } from 'app/admin/metrics/metrics.component';
import { MetricsService } from 'app/admin/metrics/metrics.service';

describe('Component Tests', () => {
  describe('MetricsMonitoringComponent', () => {
    let comp: MetricsMonitoringComponent;
    let fixture: ComponentFixture<MetricsMonitoringComponent>;
    let service: MetricsService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [MetricsMonitoringComponent]
      })
        .overrideTemplate(MetricsMonitoringComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(MetricsMonitoringComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MetricsService);
    });

    describe('refresh', () => {
      it('Should handle response on refreshing metrics data', () => {
        // GIVEN
        const response = {
          timers: {
            service: 'test',
            unrelatedKey: 'test'
          },
          gauges: {
            'jcache.statistics': {
              value: 2
            },
            unrelatedKey: 'test'
          }
        };
        comp.activeRoute = {
          path: 'pathApp1',
          prefix: 'prefixApp1',
          appName: 'appName1',
          status: 'UP',
          serviceId: '1'
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
