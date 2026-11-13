import { KeyValuePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

import { HealthModel } from 'app/admin/health/health.model';
import { HealthService } from 'app/admin/health/health.service';
import { AccountService } from 'app/core/auth';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { LoginOAuth2Service } from 'app/login/login-oauth2.service';
import { ApplicationsService, Instance } from 'app/registry/applications/applications.service';
import RefreshSelector from 'app/shared/refresh/refresh-selector';
import { RefreshService } from 'app/shared/refresh/refresh.service';

import { EurekaStatus, EurekaStatusService } from './eureka-status.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [KeyValuePipe, RefreshSelector],
})
export default class Home implements OnInit {
  readonly account = inject(AccountService).account;
  readonly health = signal<HealthModel | undefined>(undefined);
  readonly appInstances = signal<Instance[]>([]);
  readonly status = signal<EurekaStatus | undefined>(undefined);
  readonly version: string;

  private readonly destroyRef = inject(DestroyRef);
  private readonly accountService = inject(AccountService);
  private readonly loginOAuth2Service = inject(LoginOAuth2Service);
  private readonly eurekaStatusService = inject(EurekaStatusService);
  private readonly applicationsService = inject(ApplicationsService);
  private readonly healthService = inject(HealthService);
  private readonly profileService = inject(ProfileService);
  private readonly refreshService = inject(RefreshService);
  private readonly router = inject(Router);

  constructor() {
    const { VERSION } = environment;
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    } else {
      this.version = '';
    }
  }

  ngOnInit(): void {
    this.accountService
      .identity()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(account => {
        if (account) {
          this.refreshService.refreshReload$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.populateDashboard());
          this.populateDashboard();
        } else {
          this.login();
        }
      });
  }

  login(): void {
    this.profileService
      .getProfileInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(profileInfo => {
        if (profileInfo.activeProfiles?.includes('oauth2')) {
          this.loginOAuth2Service.login();
        } else {
          this.router.navigate(['/login']);
        }
      });
  }

  populateDashboard(): void {
    this.eurekaStatusService
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.status.set(data.status));

    this.applicationsService
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(applications =>
        this.appInstances.set(
          applications.flatMap(application => application.instances.map(instance => ({ ...instance, name: application.name }))),
        ),
      );

    this.healthService
      .checkHealth()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: health => this.health.set(health),
        error: (error: HttpErrorResponse) => {
          if (error.status === 503) {
            this.health.set(error.error);
          }
        },
      });
  }

  getBadgeClass(statusState?: string): string {
    return statusState === 'UP' ? 'bg-success' : 'bg-danger';
  }
}
