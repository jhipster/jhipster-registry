import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { JHipsterRegistryTestModule } from '../../../test.module';
import { JhiRefreshService } from 'app/shared/refresh/refresh.service';
import { JhiApplicationsComponent } from 'app/registry/applications/applications.component';
import { JhiApplicationsService } from 'app/registry/applications/applications.service';

describe('Component Tests', () => {
  describe('ApplicationsComponent', () => {
    let comp: JhiApplicationsComponent;
    let fixture: ComponentFixture<JhiApplicationsComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [JhiApplicationsComponent],
        providers: [JhiApplicationsService, JhiRefreshService]
      })
        .overrideTemplate(JhiApplicationsComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(JhiApplicationsComponent);
      comp = fixture.componentInstance;
    });

    it('refresh data', fakeAsync(
      inject([JhiApplicationsService], (service: JhiApplicationsService) => {
        const response = {
          applications: [
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
          ]
        };
        spyOn(service, 'findAll').and.returnValue(of(response));

        comp.ngOnInit();
        tick();

        expect(service.findAll).toHaveBeenCalled();
        expect(comp.data).toEqual(response);
      })
    ));
  });
});
