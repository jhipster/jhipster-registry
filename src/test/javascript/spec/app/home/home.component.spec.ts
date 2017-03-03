import {ComponentFixture, TestBed, async, inject, fakeAsync, tick} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {Http, BaseRequestOptions} from '@angular/http';
import {EurekaStatusService} from "../../../../../main/webapp/app/home/eureka.status.service";
import {HomeComponent} from "../../../../../main/webapp/app/home/home.component";
import {EventManager} from "ng-jhipster";
import {LoginModalService} from "../../../../../main/webapp/app/shared/login/login-modal.service";
import {Principal} from "../../../../../main/webapp/app/shared/auth/principal.service";
import {Observable} from "rxjs";
import {AccountService} from "../../../../../main/webapp/app/shared/auth/account.service";
import {Account} from "../../../../../main/webapp/app/shared/user/account.model";


describe('Component Tests', () => {

    describe('HomeComponent', () => {

        let comp: HomeComponent;
        let fixture: ComponentFixture<HomeComponent>;

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
                    EurekaStatusService
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
        });

        it('populate Dashboard',
            fakeAsync(
                inject([EurekaStatusService, Principal], (service: EurekaStatusService, principal: Principal) => {
                    let account = new Account(true, ['ROLE_ADMIN'],
                        "admin@admin.com",
                        "firstname",
                        "en",
                        "lastname",
                        "admin", "");
                    spyOn(principal, "identity").and.returnValue(Promise.resolve(account));
                    spyOn(principal, "isAuthenticated").and.returnValue(true);
                    spyOn(service, "findAll").and.returnValue(Observable.of({
                        status: {
                            environment: "test"
                        }
                    }));

                    comp.ngOnInit();
                    tick();

                    expect(service.findAll).toHaveBeenCalled();
                    expect(comp.status).toEqual({environment: "test"});
                })
            )
        );
    });
})
;
