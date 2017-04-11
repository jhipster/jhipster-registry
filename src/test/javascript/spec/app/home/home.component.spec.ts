import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { EventManager } from 'ng-jhipster';

import { EurekaStatusService, HomeComponent } from '../../../../../main/webapp/app/home';
import { Account, AccountService, Principal, LoginModalService } from '../../../../../main/webapp/app/shared';
import { JhiApplicationsService } from '../../../../../main/webapp/app/applications';
import { JhiHealthService } from "../../../../../main/webapp/app/admin/health/health.service";

describe('Component Tests', () => {

    describe('HomeComponent', () => {

        let account: Account;
        let comp: HomeComponent;
        let fixture: ComponentFixture<HomeComponent>;
        let principal: Principal;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [HomeComponent],
                providers: [
                    MockBackend,
                    Principal,
                    AccountService,
                    BaseRequestOptions,
                    {
                        provide: Http,
                        useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backendInstance, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    },
                    EventManager,
                    {
                        provide: LoginModalService,
                        useValue: {
                            open() {
                            }
                        }
                    },
                    EurekaStatusService,
                    JhiApplicationsService,
                    JhiHealthService
                ]
            })
                .overrideComponent(HomeComponent, {
                    set: {
                        template: ''
                    }
                })
                .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(HomeComponent);
            comp = fixture.componentInstance;
            principal = fixture.debugElement.injector.get(Principal);

            account = new Account(true, ['ROLE_ADMIN'],
                'admin@admin.com',
                'firstname',
                'en',
                'lastname',
                'admin', '');
            spyOn(principal, 'identity').and.returnValue(Promise.resolve(account));
            spyOn(principal, 'isAuthenticated').and.returnValue(true);
        });

        it('populate Dashboard with Eureka status data',
            fakeAsync(
                inject([EurekaStatusService], (service: EurekaStatusService) => {
                    spyOn(service, 'findAll').and.returnValue(Observable.of({
                        status: {
                            environment: 'test'
                        }
                    }));

                    comp.ngOnInit();
                    tick();

                    expect(service.findAll).toHaveBeenCalled();
                    expect(comp.status).toEqual({environment: 'test'});
                })
            )
        );

        it('populate Dashboard with Applications data',
            fakeAsync(
                inject([JhiApplicationsService], (service: JhiApplicationsService) => {

                    spyOn(service, 'findAll').and.returnValue(Observable.of({
                        status: null,
                        applications: [
                            {
                                name: 'app1',
                                instances: [
                                    {
                                        instanceId: 1,
                                        status: 'UP'
                                    },
                                    {
                                        instanceId: 2,
                                        status: 'DOWN'
                                    }
                                ]
                            },
                            {
                                name: 'app2',
                                instances: [
                                    {
                                        instanceId: 3,
                                        status: 'UP'
                                    }
                                ]
                            }
                        ]
                    }));

                    comp.ngOnInit();
                    tick();

                    expect(service.findAll).toHaveBeenCalled();
                    expect(comp.appInstances.length).toEqual(3);
                })
            )
        );
    });
})
;
