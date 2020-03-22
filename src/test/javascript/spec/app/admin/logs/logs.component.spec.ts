import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { JHipsterRegistryTestModule } from '../../../test.module';
import { LogsComponent } from 'app/admin/logs/logs.component';
import { LogsService } from 'app/admin/logs/logs.service';
import { Log } from 'app/admin/logs/log.model';
import { Route } from 'app/shared/routes/route.model';
import { RoutesService } from 'app/shared/routes/routes.service';

describe('Component Tests', () => {
  describe('LogsComponent', () => {
    let comp: LogsComponent;
    let fixture: ComponentFixture<LogsComponent>;
    let service: LogsService;
    let routesService: RoutesService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [LogsComponent],
        providers: [LogsService, RoutesService]
      })
        .overrideTemplate(LogsComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LogsComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(LogsService);
      routesService = fixture.debugElement.injector.get(RoutesService);
    });

    describe('OnInit', () => {
      it('should set all default values correctly', () => {
        expect(comp.filter).toBe('');
        expect(comp.orderProp).toBe('name');
        expect(comp.reverse).toBe(false);
      });
    });

    describe('refresh', () => {
      it('Should handle response on refreshing logs data', () => {
        // GIVEN
        const activeRoute: Route = {
          path: 'pathApp1',
          prefix: 'prefixApp1',
          appName: 'appName1',
          status: 'UP',
          serviceId: '1'
        };
        comp.activeRoute = activeRoute;
        comp.routes = [activeRoute];
        const log = new Log('main', 'WARN');
        spyOn(service, 'findInstanceAll').and.returnValue(
          of({
            loggers: {
              main: {
                effectiveLevel: 'WARN'
              }
            }
          })
        );

        // WHEN
        comp.refreshActiveRouteLogs();

        // THEN
        expect(service.findInstanceAll).toHaveBeenCalled();
        expect(comp.loggers![0]).toEqual(jasmine.objectContaining(log));
      });

      it('should handle a 503 on refreshing logs data', () => {
        // GIVEN
        const activeRoute: Route = {
          path: 'pathApp1',
          prefix: 'prefixApp1',
          appName: 'appName1',
          status: 'UP',
          serviceId: '1'
        };
        comp.activeRoute = activeRoute;
        comp.routes = [activeRoute];
        spyOn(service, 'findInstanceAll').and.returnValue(throwError(new HttpErrorResponse({ status: 503, error: 'Mail down' })));
        spyOn(routesService, 'routeDown').and.stub();

        // WHEN
        comp.refreshActiveRouteLogs();

        // THEN
        expect(service.findInstanceAll).toHaveBeenCalled();
        expect(routesService.routeDown).toHaveBeenCalled();
      });
    });

    describe('change log level', () => {
      it('should change log level correctly', () => {
        // GIVEN
        const activeRoute: Route = {
          path: 'pathApp1',
          prefix: 'prefixApp1',
          appName: 'appName1',
          status: 'UP',
          serviceId: '1'
        };
        comp.activeRoute = activeRoute;
        comp.routes = [activeRoute];
        spyOn(service, 'changeInstanceLevel').and.returnValue(of(new HttpResponse()));
        const log = new Log('main', 'WARN');
        spyOn(service, 'findInstanceAll').and.returnValue(
          of({
            loggers: {
              main: {
                effectiveLevel: 'WARN'
              }
            }
          })
        );

        // WHEN
        comp.changeLevel('main', 'ERROR');

        // THEN
        expect(service.changeInstanceLevel).toHaveBeenCalled();
        expect(service.findInstanceAll).toHaveBeenCalled();
        expect(comp.loggers![0]).toEqual(jasmine.objectContaining(log));
      });
    });
  });
});
