import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of } from 'rxjs';

import { HealthService } from 'app/admin/health/health.service';
import { Account, AccountService } from 'app/core/auth';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { LoginOAuth2Service } from 'app/login/login-oauth2.service';
import { ApplicationsService } from 'app/registry/applications/applications.service';

import { EurekaStatusService } from './eureka-status.service';
import Home from './home';

describe('Home Component', () => {
  let comp: Home;
  let fixture: ComponentFixture<Home>;
  let mockRouter: Router;
  let accountService: AccountService;
  let profileService: ProfileService;
  let loginOAuth2Service: LoginOAuth2Service;

  const account: Account = {
    activated: true,
    authorities: ['ROLE_ADMIN'],
    email: '',
    firstName: null,
    langKey: '',
    lastName: null,
    login: 'admin',
    imageUrl: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    fixture = TestBed.createComponent(Home);
    comp = fixture.componentInstance;

    mockRouter = TestBed.inject(Router);
    vi.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    accountService = TestBed.inject(AccountService);
    profileService = TestBed.inject(ProfileService);
    loginOAuth2Service = TestBed.inject(LoginOAuth2Service);
    vi.spyOn(loginOAuth2Service, 'login').mockImplementation(() => {});
  });

  describe('login', () => {
    it('should navigate to /login when the oauth2 profile is not active', () => {
      vi.spyOn(profileService, 'getProfileInfo').mockReturnValue(of({ activeProfiles: ['dev'] }));

      comp.login();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      expect(loginOAuth2Service.login).not.toHaveBeenCalled();
    });

    it('should redirect to the identity provider when the oauth2 profile is active', () => {
      vi.spyOn(profileService, 'getProfileInfo').mockReturnValue(of({ activeProfiles: ['prod', 'oauth2'] }));

      comp.login();

      expect(loginOAuth2Service.login).toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should ask the user to sign in when there is no account', () => {
      vi.spyOn(accountService, 'identity').mockReturnValue(of(null));
      vi.spyOn(profileService, 'getProfileInfo').mockReturnValue(of({ activeProfiles: ['dev'] }));

      comp.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should populate the dashboard when the user is authenticated', () => {
      vi.spyOn(accountService, 'identity').mockReturnValue(of(account));
      vi.spyOn(TestBed.inject(EurekaStatusService), 'findAll').mockReturnValue(of({ status: { environment: 'test' } }));
      vi.spyOn(TestBed.inject(ApplicationsService), 'findAll').mockReturnValue(
        of([
          {
            name: 'app1',
            instances: [
              { instanceId: 'app1:1', status: 'UP' },
              { instanceId: 'app1:2', status: 'DOWN' },
            ],
          },
        ]),
      );
      vi.spyOn(TestBed.inject(HealthService), 'checkHealth').mockReturnValue(of({ status: 'UP', components: {} }));

      comp.ngOnInit();

      expect(comp.status()).toEqual({ environment: 'test' });
      expect(comp.appInstances()).toEqual([
        { name: 'app1', instanceId: 'app1:1', status: 'UP' },
        { name: 'app1', instanceId: 'app1:2', status: 'DOWN' },
      ]);
      expect(comp.health()).toEqual({ status: 'UP', components: {} });
    });
  });

  describe('getBadgeClass', () => {
    it('should return a success badge only for UP', () => {
      expect(comp.getBadgeClass('UP')).toBe('bg-success');
      expect(comp.getBadgeClass('DOWN')).toBe('bg-danger');
    });
  });
});
