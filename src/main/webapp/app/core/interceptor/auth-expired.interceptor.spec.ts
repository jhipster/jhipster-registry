import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AccountService, StateStorageService } from 'app/core/auth';
import { LoginService } from 'app/login/login.service';

import { authExpiredInterceptor } from './auth-expired.interceptor';

describe('authExpiredInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: Router;
  let stateStorageService: StateStorageService;
  const accountService = { isAuthenticated: vi.fn() };
  const loginService = { logout: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authExpiredInterceptor])),
        provideHttpClientTesting(),
        { provide: AccountService, useValue: accountService },
        { provide: LoginService, useValue: loginService },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    stateStorageService = TestBed.inject(StateStorageService);
    vi.spyOn(stateStorageService, 'storeUrl');
  });

  function failWith401(url: string): void {
    http.get(url).subscribe({ error() {} });
    httpMock.expectOne(url).flush(null, { status: 401, statusText: 'Unauthorized' });
  }

  it('should sign out and remember the page when a signed-in user gets a 401', () => {
    accountService.isAuthenticated.mockReturnValue(true);

    failWith401('api/eureka/applications');

    expect(stateStorageService.storeUrl).toHaveBeenCalledTimes(1);
    expect(loginService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not overwrite the remembered page when further requests fail after signing out', () => {
    accountService.isAuthenticated.mockReturnValueOnce(true).mockReturnValue(false);

    failWith401('api/eureka/applications');
    failWith401('api/eureka/status');

    expect(stateStorageService.storeUrl).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledTimes(1);
  });

  it('should ignore a failed sign-in', () => {
    accountService.isAuthenticated.mockReturnValue(false);

    failWith401('api/authenticate');

    expect(stateStorageService.storeUrl).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should ignore the account request', () => {
    accountService.isAuthenticated.mockReturnValue(true);

    failWith401('api/account');

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
