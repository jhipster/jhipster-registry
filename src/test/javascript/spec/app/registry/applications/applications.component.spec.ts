import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { JHipsterRegistryTestModule } from '../../../test.module';
import { JhiApplicationsComponent, JhiApplicationsService } from 'app/registry';
import { JhiRefreshService } from 'app/shared';

describe('Component Tests', () => {
    describe('ApplicationsComponent', () => {
        let comp: JhiApplicationsComponent;
        let fixture: ComponentFixture<JhiApplicationsComponent>;

        beforeEach(
            async(() => {
                TestBed.configureTestingModule({
                    imports: [JHipsterRegistryTestModule],
                    declarations: [JhiApplicationsComponent],
                    providers: [JhiApplicationsService, JhiRefreshService]
                })
                    .overrideTemplate(JhiApplicationsComponent, '')
                    .compileComponents();
            })
        );

        beforeEach(() => {
            fixture = TestBed.createComponent(JhiApplicationsComponent);
            comp = fixture.componentInstance;
        });

        it(
            'refresh data',
            fakeAsync(
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
                    spyOn(service, 'findAll').and.returnValue(Observable.of(response));

                    comp.ngOnInit();
                    tick();

                    expect(service.findAll).toHaveBeenCalled();
                    expect(comp.data).toEqual(response);
                })
            )
        );
    });
});
