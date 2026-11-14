import { Service, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

import { ProfileService } from 'app/layouts/profiles/profile.service';

import { LoginOAuth2Service } from './login-oauth2.service';

/**
 * Decides how a user signs in: at the identity provider when the registry runs with the oauth2 profile,
 * on the sign-in page of the registry otherwise.
 */
@Service()
export class SignInService {
  private readonly profileService = inject(ProfileService);
  private readonly loginOAuth2Service = inject(LoginOAuth2Service);
  private readonly router = inject(Router);

  usesOAuth2(): Observable<boolean> {
    return this.profileService.getProfileInfo().pipe(map(profileInfo => profileInfo.activeProfiles?.includes('oauth2') ?? false));
  }

  signIn(): void {
    this.usesOAuth2().subscribe(oauth2 => {
      if (oauth2) {
        this.loginOAuth2Service.login();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
