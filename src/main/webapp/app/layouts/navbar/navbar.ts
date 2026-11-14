import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { displayVersion } from 'app/config/version';
import { AccountService } from 'app/core/auth';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { LoginOAuth2Service } from 'app/login/login-oauth2.service';
import { LoginService } from 'app/login/login.service';
import { SignInService } from 'app/login/sign-in.service';
import { HasAnyAuthorityDirective } from 'app/shared/auth';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  imports: [
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    NgbCollapse,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    HasAnyAuthorityDirective,
  ],
})
export default class Navbar implements OnInit {
  readonly inProduction = signal(true);
  readonly isNavbarCollapsed = signal(true);
  readonly openAPIEnabled = signal(false);
  readonly version = displayVersion;
  readonly account = inject(AccountService).account;

  private readonly loginService = inject(LoginService);
  private readonly signInService = inject(SignInService);
  private readonly loginOAuth2Service = inject(LoginOAuth2Service);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction.set(profileInfo.inProduction ?? true);
      this.openAPIEnabled.set(profileInfo.openAPIEnabled ?? false);
    });
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed.set(true);
  }

  login(): void {
    this.signInService.signIn();
  }

  logout(): void {
    this.collapseNavbar();
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      if (profileInfo.activeProfiles?.includes('oauth2')) {
        this.loginOAuth2Service.logout().subscribe(logout => {
          window.location.href = logout.logoutUrl;
        });
      } else {
        this.loginService.logout();
        this.router.navigate(['']);
      }
    });
  }
}
