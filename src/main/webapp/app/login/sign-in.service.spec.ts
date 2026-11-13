import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of } from 'rxjs';

import { ProfileService } from 'app/layouts/profiles/profile.service';

import { LoginOAuth2Service } from './login-oauth2.service';
import { SignInService } from './sign-in.service';

describe('SignInService', () => {
  let service: SignInService;
  let router: Router;
  let profileService: ProfileService;
  let loginOAuth2Service: LoginOAuth2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(SignInService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    profileService = TestBed.inject(ProfileService);
    loginOAuth2Service = TestBed.inject(LoginOAuth2Service);
    vi.spyOn(loginOAuth2Service, 'login').mockImplementation(() => {});
  });

  it('should open the sign-in page when the oauth2 profile is not active', () => {
    vi.spyOn(profileService, 'getProfileInfo').mockReturnValue(of({ activeProfiles: ['dev'] }));

    service.signIn();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(loginOAuth2Service.login).not.toHaveBeenCalled();
  });

  it('should go to the identity provider when the oauth2 profile is active', () => {
    vi.spyOn(profileService, 'getProfileInfo').mockReturnValue(of({ activeProfiles: ['prod', 'oauth2'] }));

    service.signIn();

    expect(loginOAuth2Service.login).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should treat missing profile information as not using OAuth2', () => {
    vi.spyOn(profileService, 'getProfileInfo').mockReturnValue(of({}));
    let oauth2: boolean | undefined;

    service.usesOAuth2().subscribe(value => (oauth2 = value));

    expect(oauth2).toBe(false);
  });
});
