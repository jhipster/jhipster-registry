import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { JhiApplicationsComponent, JhiApplicationsService } from '../../../../../main/webapp/app/applications';


describe('Component Tests', () => {

    describe('ApplicationsComponent', () => {

        let comp: JhiApplicationsComponent;
        let fixture: ComponentFixture<JhiApplicationsComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [JhiApplicationsComponent],
                providers: [
                    MockBackend,
                    BaseRequestOptions,
                    {
                        provide: Http,
                        useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backendInstance, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    },
                    JhiApplicationsService
                ]
            })
                .overrideComponent(JhiApplicationsComponent, {
                    set: {
                        template: ''
                    }
                })
                .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(JhiApplicationsComponent);
            comp = fixture.componentInstance;
        });

        it('refresh data',
            fakeAsync(
                inject([JhiApplicationsService], (service: JhiApplicationsService) => {
                    let response = {
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
})
;
