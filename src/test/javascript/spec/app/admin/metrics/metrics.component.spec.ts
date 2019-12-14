import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';

import { JHipsterRegistryTestModule } from '../../../test.module';
import { JhiMetricsMonitoringComponent } from 'app/admin/metrics/metrics.component';
import { JhiMetricsService } from 'app/admin/metrics/metrics.service';

describe('Component Tests', () => {
  describe('JhiMetricsMonitoringComponent', () => {
    let comp: JhiMetricsMonitoringComponent;
    let fixture: ComponentFixture<JhiMetricsMonitoringComponent>;
    let service: JhiMetricsService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [JhiMetricsMonitoringComponent]
      })
        .overrideTemplate(JhiMetricsMonitoringComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(JhiMetricsMonitoringComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(JhiMetricsService);
    });

    describe('refresh', () => {
      it('should refresh metrics data', () => {
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
          serviceId: '1',
          serviceInstances: []
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
