import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';

import { ProfileService } from 'app/layouts/profiles/profile.service';

import { VERSION } from 'app/app.constants';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { LoginService } from 'app/core/login/login.service';
import { LoginOAuth2Service } from 'app/shared/oauth2/login-oauth2.service';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['navbar.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  swaggerEnabled?: boolean;
  version: string = VERSION ? 'v' + VERSION : '';
  unsubscribe$ = new Subject();
  subscription?: Subscription;

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private loginOAuth2Service: LoginOAuth2Service,
    private loginModalService: LoginModalService,
    private profileService: ProfileService,
    private eventManager: JhiEventManager,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProfileInfo();
    this.registerAuthenticationSuccess();
  }

  registerAuthenticationSuccess(): void {
    this.subscription = this.eventManager.subscribe('authenticationSuccess', () => this.getProfileInfo());
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginModalService.open();
  }

  logout(): void {
    this.collapseNavbar();
    this.profileService
      .getProfileInfo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(profileInfo => {
        if (profileInfo.activeProfiles!.includes('oauth2')) {
          this.loginOAuth2Service.logout().subscribe(response => {
            const data = response.body;
            let logoutUrl = data.logoutUrl;
            // if Keycloak, uri has protocol/openid-connect/token
            if (logoutUrl.indexOf('/protocol') > -1) {
              logoutUrl = logoutUrl + '?redirect_uri=' + window.location.origin;
            } else {
              // Okta
              logoutUrl = logoutUrl + '?id_token_hint=' + data.idToken + '&post_logout_redirect_uri=' + window.location.origin;
            }
            window.location.href = logoutUrl;
          });
        } else {
          this.loginService.logout();
          this.router.navigate(['']);
        }
      });
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  getProfileInfo(): void {
    this.profileService
      .getProfileInfo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(profileInfo => {
        this.inProduction = profileInfo.inProduction;
        this.swaggerEnabled = profileInfo.swaggerEnabled;
      });
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.subscription!.unsubscribe();
  }
}
