import { KeyValuePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HealthModel } from 'app/admin/health/health.model';
import { HealthService } from 'app/admin/health/health.service';
import { displayVersion } from 'app/config/version';
import { AccountService } from 'app/core/auth';
import { SignInService } from 'app/login/sign-in.service';
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
  readonly version = displayVersion;

  private readonly destroyRef = inject(DestroyRef);
  private readonly accountService = inject(AccountService);
  private readonly signInService = inject(SignInService);
  private readonly eurekaStatusService = inject(EurekaStatusService);
  private readonly applicationsService = inject(ApplicationsService);
  private readonly healthService = inject(HealthService);
  private readonly refreshService = inject(RefreshService);

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
    this.signInService.signIn();
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
