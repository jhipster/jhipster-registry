jest.mock('app/core/auth/account.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { of } from 'rxjs';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { ApplicationsService } from 'app/registry/applications/applications.service';
import { HealthService } from 'app/shared/health/health.service';
import { LoginOAuth2Service } from 'app/login/login-oauth2.service';
import { RefreshService } from 'app/shared/refresh/refresh.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { EurekaStatusService } from './eureka.status.service';
import { HomeComponent } from './home.component';

describe('Component Tests', () => {
  describe('HomeComponent', () => {
    let account: Account;
    let comp: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let mockAccountService: AccountService;
    let mockApplicationService: ApplicationsService;
    let mockEurekaStatusService: EurekaStatusService;
    let mockProfileService: ProfileService;
    let mockRouter: Router;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot(), RouterTestingModule.withRoutes([])],
          declarations: [HomeComponent],
          providers: [
            AccountService,
            EventManager,
            EurekaStatusService,
            ApplicationsService,
            HealthService,
            LoginOAuth2Service,
            ProfileService,
            RefreshService,
          ],
        })
          .overrideTemplate(HomeComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(HomeComponent);
      comp = fixture.componentInstance;
      mockAccountService = TestBed.inject(AccountService);
      mockAccountService.identity = jest.fn(() => of(null));
      mockAccountService.getAuthenticationState = jest.fn(() => of(null));
      mockRouter = TestBed.inject(Router);
      mockApplicationService = TestBed.inject(ApplicationsService);
      mockEurekaStatusService = TestBed.inject(EurekaStatusService);
      mockProfileService = TestBed.inject(ProfileService);

      account = new Account(true, ['ROLE_ADMIN'], 'admin@admin.com', 'firstname', 'en', 'lastname', 'admin', '');
      jest.spyOn(mockAccountService, 'identity').mockReturnValue(of(account));
      jest.spyOn(mockAccountService, 'isAuthenticated').mockReturnValue(true);
    });

    it('Should call accountService.isAuthenticated when it checks authentication', () => {
      // WHEN
      comp.isAuthenticated();

      // THEN
      expect(mockAccountService.isAuthenticated).toHaveBeenCalled();
    });

    it('Should navigate to /login on login', () => {
      // GIVEN
      jest.spyOn(mockProfileService, 'getProfileInfo').mockReturnValue(
        of({
          git: {},
          'cloud-config-label': 'main',
          'cloud-config-server-configuration-sources': [
            {
              type: 'native',
              'search-locations': 'file:./central-config',
            },
          ],
          activeProfiles: ['composite', 'dev', 'api-docs'],
        })
      );
      jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));

      // WHEN
      comp.login();

      // THEN
      expect(mockProfileService.getProfileInfo).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('populate Dashboard with Eureka status data', () => {
      jest.spyOn(mockEurekaStatusService, 'findAll').mockReturnValue(
        of({
          status: {
            environment: 'test',
          },
        })
      );

      comp.ngOnInit();

      expect(mockEurekaStatusService.findAll).toHaveBeenCalled();
      expect(comp.status).toEqual({ environment: 'test' });
    });

    it('populate Dashboard with Applications data', () => {
      jest.spyOn(mockApplicationService, 'findAll').mockReturnValue(
        of([
          {
            name: 'app1',
            instances: [
              {
                instanceId: 1,
                status: 'UP',
              },
              {
                instanceId: 2,
                status: 'DOWN',
              },
            ],
          },
          {
            name: 'app2',
            instances: [
              {
                instanceId: 3,
                status: 'UP',
              },
            ],
          },
        ])
      );

      comp.ngOnInit();

      expect(mockApplicationService.findAll).toHaveBeenCalled();
      expect(comp.appInstances.length).toEqual(3);
    });
  });
});
