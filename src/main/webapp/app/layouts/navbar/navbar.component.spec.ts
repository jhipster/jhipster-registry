jest.mock('app/core/auth/account.service');
jest.mock('app/login/login.service');
jest.mock('app/login/login-oauth2.service');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { ProfileInfo } from 'app/layouts/profiles/profile-info.model';
import { LoginService } from 'app/login/login.service';
import { LoginOAuth2Service } from 'app/login/login-oauth2.service';

import { NavbarComponent } from './navbar.component';

describe('Component Tests', () => {
  describe('Navbar Component', () => {
    let comp: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let mockAccountService: AccountService;
    let mockProfileService: ProfileService;
    let mockLoginService: LoginService;
    let mockLoginOAuth2Service: LoginOAuth2Service;
    let mockRouter: Router;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
        declarations: [NavbarComponent],
        providers: [AccountService, LoginService, LoginOAuth2Service],
      })
        .overrideTemplate(NavbarComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(NavbarComponent);
      comp = fixture.componentInstance;
      mockAccountService = TestBed.inject(AccountService);
      mockProfileService = TestBed.inject(ProfileService);
      mockLoginService = TestBed.inject(LoginService);
      mockLoginOAuth2Service = TestBed.inject(LoginOAuth2Service);
      mockRouter = TestBed.inject(Router);
    });

    it('Should call profileService.getProfileInfo on init', () => {
      // GIVEN
      jest.spyOn(mockProfileService, 'getProfileInfo').mockReturnValue(of(new ProfileInfo()));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(mockProfileService.getProfileInfo).toHaveBeenCalled();
    });

    it('Should call accountService.isAuthenticated on authentication', () => {
      // WHEN
      comp.isAuthenticated();

      // THEN
      expect(mockAccountService.isAuthenticated).toHaveBeenCalled();
    });

    it('Should call loginService.logout on logout if OAuth2 profile is not active', () => {
      // GIVEN
      jest.spyOn(mockProfileService, 'getProfileInfo').mockReturnValue(
        of({
          activeProfiles: [],
        })
      );
      jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));

      // WHEN
      comp.logout();

      // THEN
      expect(mockLoginService.logout).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    });

    it('Should call loginService.logout on logout if OAuth2 profile is active', () => {
      // GIVEN
      jest.spyOn(mockProfileService, 'getProfileInfo').mockReturnValue(
        of({
          activeProfiles: ['oauth2'],
        })
      );

      // WHEN
      comp.logout();

      // THEN
      expect(mockLoginOAuth2Service.logout).toHaveBeenCalled();
    });
  });
});
