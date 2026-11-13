import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs';

import { AccountService, StateStorageService } from 'app/core/auth';
import { LoginService } from 'app/login/login.service';

export const authExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const loginService = inject(LoginService);
  const stateStorageService = inject(StateStorageService);
  const router = inject(Router);

  return next(req).pipe(
    tap({
      error(err: HttpErrorResponse) {
        // Only the first 401 of a signed-in user counts: later ones would store the sign-in page as the page to return to
        if (err.status === 401 && err.url && !err.url.includes('api/account') && accountService.isAuthenticated()) {
          stateStorageService.storeUrl(router.routerState.snapshot.url);
          loginService.logout();
          router.navigate(['/login']);
        }
      },
    }),
  );
};
