import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
  inProduction: boolean;
  isNavbarCollapsed: boolean;
  swaggerEnabled: boolean;
  modalRef: NgbModalRef;
  version: string;
  unsubscribe$ = new Subject();
  subscription = new Subscription();

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private loginOAuth2Service: LoginOAuth2Service,
    private loginModalService: LoginModalService,
    private profileService: ProfileService,
    private eventManager: JhiEventManager,
    private router: Router
  ) {
    this.version = VERSION ? 'v' + VERSION : '';
    this.isNavbarCollapsed = true;
  }

  ngOnInit() {
    this.getProfileInfo();
    this.registerAuthenticationSuccess();
  }

  registerAuthenticationSuccess() {
    this.subscription = this.eventManager.subscribe('authenticationSuccess', () => this.getProfileInfo());
  }

  collapseNavbar() {
    this.isNavbarCollapsed = true;
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  login() {
    this.modalRef = this.loginModalService.open();
  }

  logout() {
    this.collapseNavbar();
    this.profileService
      .getProfileInfo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(profileInfo => {
        if (profileInfo.activeProfiles.includes('oauth2')) {
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

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  getProfileInfo() {
    this.profileService
      .getProfileInfo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(profileInfo => {
        this.inProduction = profileInfo.inProduction;
        this.swaggerEnabled = profileInfo.swaggerEnabled;
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
