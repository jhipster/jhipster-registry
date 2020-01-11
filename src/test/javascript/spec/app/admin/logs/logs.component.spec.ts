import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

import { JHipsterRegistryTestModule } from '../../../test.module';
import { LogsComponent } from 'app/admin/logs/logs.component';
import { LogsService } from 'app/admin/logs/logs.service';
import { Log } from 'app/admin/logs/log.model';

describe('Component Tests', () => {
  describe('LogsComponent', () => {
    let comp: LogsComponent;
    let fixture: ComponentFixture<LogsComponent>;
    let service: LogsService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [LogsComponent],
        providers: [LogsService]
      })
        .overrideTemplate(LogsComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LogsComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(LogsService);
    });

    describe('OnInit', () => {
      it('should set all default values correctly', () => {
        expect(comp.filter).toBe('');
        expect(comp.orderProp).toBe('name');
        expect(comp.reverse).toBe(false);
      });
    });
    describe('refresh', () => {
      it('Should refresh logs data', () => {
        // GIVEN
        const headers = new HttpHeaders().append('link', 'link;link');
        const log = new Log('main', 'WARN');
        const activeRoute = {
          path: 'pathApp1',
          prefix: 'prefixApp1',
          appName: 'appName1',
          status: 'UP',
          serviceId: '1',
          serviceInstances: []
        };
        comp.activeRoute = activeRoute;
        comp.routes = [activeRoute];
        spyOn(service, 'findInstanceAll').and.returnValue(
          of(
            new HttpResponse({
              body: {
                loggers: {
                  main: {
                    effectiveLevel: 'WARN'
                  }
                }
              },
              headers
            })
          )
        );

        // WHEN
        comp.refreshActiveRouteLogs();

        // THEN
        expect(service.findInstanceAll).toHaveBeenCalled();
        expect(comp.loggers[0]).toEqual(jasmine.objectContaining(log));
      });
      it('should handle a 503 on refreshing logs data', () => {
        // GIVEN
        const activeRoute = {
          path: 'pathApp1',
          prefix: 'prefixApp1',
          appName: 'appName1',
          status: 'UP',
          serviceId: '1',
          serviceInstances: []
        };
        comp.activeRoute = activeRoute;
        comp.routes = [activeRoute];
        spyOn(service, 'findInstanceAll').and.returnValue(throwError(new HttpErrorResponse({ status: 503, error: 'Mail down' })));

        // WHEN
        comp.refreshActiveRouteLogs();

        // THEN
        expect(service.findInstanceAll).toHaveBeenCalled();
        expect(comp.updatingLogs).toEqual(false);
      });
    });
    describe('change log level', () => {
      it('should change log level correctly', () => {
        // GIVEN
        const log = new Log('main', 'ERROR');
        const activeRoute = {
          path: 'pathApp1',
          prefix: 'prefixApp1',
          appName: 'appName1',
          status: 'UP',
          serviceId: '1',
          serviceInstances: []
        };
        comp.activeRoute = activeRoute;
        comp.routes = [activeRoute];
        spyOn(service, 'changeInstanceLevel').and.returnValue(of(new HttpResponse()));
        spyOn(service, 'findInstanceAll').and.returnValue(
          of(
            new HttpResponse({
              body: {
                loggers: {
                  main: {
                    effectiveLevel: 'ERROR'
                  }
                }
              }
            })
          )
        );

        // WHEN
        comp.changeLevel('main', 'ERROR');

        // THEN
        expect(service.changeInstanceLevel).toHaveBeenCalled();
        expect(service.findInstanceAll).toHaveBeenCalled();
        expect(comp.loggers[0]).toEqual(jasmine.objectContaining(log));
      });
    });
  });
});
