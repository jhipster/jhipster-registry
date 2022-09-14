import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { ApplicationsComponent } from 'app/registry/applications/applications.component';
import { Application, ApplicationsService, Instance } from 'app/registry/applications/applications.service';
import { RefreshService } from 'app/shared/refresh/refresh.service';

describe('Component Tests', () => {
  describe('ApplicationsComponent', () => {
    let comp: ApplicationsComponent;
    let fixture: ComponentFixture<ApplicationsComponent>;
    let service: ApplicationsService;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot()],
        declarations: [ApplicationsComponent],
        providers: [ApplicationsService, RefreshService],
      })
        .overrideTemplate(ApplicationsComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ApplicationsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ApplicationsService);
    });

    describe('refresh', () => {
      it('should call refresh on init', fakeAsync((): void => {
        const applications: Array<Application> = [
          {
            name: 'app1',
            instances: [
              {
                instanceId: 1,
                status: 'UP',
                homePageUrl: 'home',
              },
            ],
          },
          {
            name: 'app2',
            instances: [
              {
                instanceId: 2,
                status: 'UP',
                homePageUrl: 'home',
              },
              {
                instanceId: 3,
                status: 'UP',
                homePageUrl: 'home',
              },
            ],
          },
        ];
        jest.spyOn(service, 'findAll').mockReturnValue(of(applications));

        comp.ngOnInit();
        tick();

        expect(service.findAll).toHaveBeenCalled();
        expect(comp.instances).toEqual(applications[0].instances);
      }));
    });

    describe('displayCountInstances', () => {
      it('should display count instance', () => {
        const instances: Array<Instance> = [
          {
            instanceId: 1,
            status: 'UP',
            homePageUrl: 'home',
          },
          {
            instanceId: 2,
            status: 'DOWN',
            homePageUrl: 'home',
          },
        ];

        const result = comp.displayCountInstances(instances);
        expect(result).toEqual('1/2');
      });
    });

    describe('checkInstanceLength', () => {
      it('should return false when all instances are up', () => {
        const instances: Array<Instance> = [
          {
            instanceId: 1,
            status: 'UP',
            homePageUrl: 'home',
          },
        ];

        const result = comp.checkInstanceLength(instances);
        expect(result).toBeFalsy();
      });

      it('should return true when at least once instances is down', () => {
        const instances: Array<Instance> = [
          {
            instanceId: 1,
            status: 'UP',
            homePageUrl: 'home',
          },
          {
            instanceId: 2,
            status: 'DOWN',
            homePageUrl: 'home',
          },
        ];

        const result = comp.checkInstanceLength(instances);
        expect(result).toBeTruthy();
      });
    });

    describe('getBadgeClass', () => {
      it('should get badge class', () => {
        const upBadgeClass = comp.getBadgeClass('UP');
        const downBadgeClass = comp.getBadgeClass('DOWN');
        expect(upBadgeClass).toEqual('bg-success');
        expect(downBadgeClass).toEqual('bg-danger');
      });
    });
  });
});
