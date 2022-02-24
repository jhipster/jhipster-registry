import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VERSION } from 'app/app.constants';
import { AccountService } from 'app/core/auth/account.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { LoginService } from 'app/login/login.service';
import { LoginOAuth2Service } from 'app/login/login-oauth2.service';
import { Logout } from '../../login/logout.model';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  openAPIEnabled?: boolean;
  version: string = VERSION ? 'v' + VERSION : '';
  unsubscribe$ = new Subject();
  subscription?: Subscription;

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private loginOAuth2Service: LoginOAuth2Service,
    private profileService: ProfileService,
    private eventManager: EventManager,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProfileInfo();
    this.registerAuthenticationSuccess();
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
    this.subscription?.unsubscribe();
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
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.profileService
      .getProfileInfo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(profileInfo => {
        if (profileInfo.activeProfiles!.includes('oauth2')) {
          this.loginOAuth2Service.logout().subscribe((logout: Logout) => {
            window.location.href = logout.logoutUrl;
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
        this.openAPIEnabled = profileInfo.openAPIEnabled;
      });
  }
}
