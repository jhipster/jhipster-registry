import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { JHipsterRegistryTestModule } from '../../test.module';
import { HomeComponent } from 'app/home/home.component';
import { AccountService } from 'app/core/auth/account.service';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { EurekaStatusService } from 'app/home/eureka.status.service';
import { HealthService } from 'app/admin/health/health.service';
import { LoginOAuth2Service } from 'app/shared/oauth2/login-oauth2.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { RefreshService } from 'app/shared/refresh/refresh.service';
import { Account } from 'app/core/user/account.model';
import { ApplicationsService } from 'app/registry/applications/applications.service';

describe('Component Tests', () => {
  describe('HomeComponent', () => {
    let account: Account;
    let comp: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let accountService: AccountService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [HomeComponent],
        providers: [
          AccountService,
          JhiEventManager,
          {
            provide: LoginModalService,
            useValue: {
              open(): void {}
            }
          },
          EurekaStatusService,
          ApplicationsService,
          HealthService,
          LoginOAuth2Service,
          ProfileService,
          RefreshService
        ]
      })
        .overrideTemplate(HomeComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HomeComponent);
      comp = fixture.componentInstance;
      accountService = fixture.debugElement.injector.get(AccountService);

      account = new Account(true, ['ROLE_ADMIN'], 'admin@admin.com', 'firstname', 'en', 'lastname', 'admin', '');
      spyOn(accountService, 'identity').and.returnValue(of(account));
      spyOn(accountService, 'isAuthenticated').and.returnValue(true);
    });

    it('populate Dashboard with Eureka status data', fakeAsync(
      inject([EurekaStatusService], (service: EurekaStatusService) => {
        spyOn(service, 'findAll').and.returnValue(
          of({
            status: {
              environment: 'test'
            }
          })
        );

        comp.ngOnInit();
        tick();

        expect(service.findAll).toHaveBeenCalled();
        expect(comp.status).toEqual({ environment: 'test' });
      })
    ));

    it('populate Dashboard with Applications data', fakeAsync(
      inject([ApplicationsService], (service: ApplicationsService) => {
        spyOn(service, 'findAll').and.returnValue(
          of([
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
          ])
        );

        comp.ngOnInit();
        tick();

        expect(service.findAll).toHaveBeenCalled();
        expect(comp.appInstances.length).toEqual(3);
      })
    ));
  });
});
