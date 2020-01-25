import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { JHipsterRegistryTestModule } from '../../../test.module';
import { RefreshService } from 'app/shared/refresh/refresh.service';
import { ApplicationsComponent } from 'app/registry/applications/applications.component';
import { Application, ApplicationsService } from 'app/registry/applications/applications.service';

describe('Component Tests', () => {
  describe('ApplicationsComponent', () => {
    let comp: ApplicationsComponent;
    let fixture: ComponentFixture<ApplicationsComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [ApplicationsComponent],
        providers: [ApplicationsService, RefreshService]
      })
        .overrideTemplate(ApplicationsComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ApplicationsComponent);
      comp = fixture.componentInstance;
    });

    it('refresh data', fakeAsync(
      inject([ApplicationsService], (service: ApplicationsService) => {
        const applications: Array<Application> = [
          {
            name: 'app1',
            instances: [
              {
                instanceId: 1,
                status: 'UP',
                homePageUrl: 'home'
              }
            ]
          },
          {
            name: 'app2',
            instances: [
              {
                instanceId: 2,
                status: 'UP',
                homePageUrl: 'home'
              },
              {
                instanceId: 3,
                status: 'UP',
                homePageUrl: 'home'
              }
            ]
          }
        ];
        spyOn(service, 'findAll').and.returnValue(of(applications));

        comp.ngOnInit();
        tick();

        expect(service.findAll).toHaveBeenCalled();
        expect(comp.instances).toEqual(applications[0].instances);
      })
    ));
  });
});
