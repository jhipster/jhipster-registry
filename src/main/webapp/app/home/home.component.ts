import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VERSION } from 'app/app.constants';
import { EurekaStatusKey, EurekaStatusService } from './eureka.status.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { EventManager } from 'app/core/util/event-manager.service';
import { ApplicationsService, DiscoveryBackend, Instance } from 'app/registry/applications/applications.service';
import { LoginOAuth2Service } from 'app/login/login-oauth2.service';
import { Health, HealthStatus } from 'app/shared/health/health.model';
import { HealthService } from 'app/shared/health/health.service';
import { RefreshService } from 'app/shared/refresh/refresh.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account?: Account | null;
  updatingHealth?: boolean;
  health?: Health;
  appInstances: Array<Instance> = [];
  backend?: DiscoveryBackend;
  status?: {
    [key in EurekaStatusKey]?: any;
  };
  version: string = VERSION ? 'v' + VERSION : '';
  unsubscribe$ = new Subject();
  subscription?: Subscription;

  constructor(
    private accountService: AccountService,
    private loginOAuth2Service: LoginOAuth2Service,
    private eventManager: EventManager,
    private eurekaStatusService: EurekaStatusService,
    private applicationsService: ApplicationsService,
    private healthService: HealthService,
    private profileService: ProfileService,
    private refreshService: RefreshService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountService
      .identity()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(account => {
        this.account = account;
        if (!account || !this.isAuthenticated()) {
          this.login();
        } else {
          this.refreshService.refreshReload$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.populateDashboard());
          this.populateDashboard();
        }
      });
    this.registerAuthenticationSuccess();
  }

  registerAuthenticationSuccess(): void {
    this.subscription = this.eventManager.subscribe('authenticationSuccess', () => {
      this.accountService
        .identity()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((account: Account | null) => {
          this.account = account;
          this.refreshService.refreshReload$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.populateDashboard());
          this.populateDashboard();
        });
    });
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.profileService
      .getProfileInfo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(profileInfo => {
        if (profileInfo.activeProfiles!.includes('oauth2')) {
          this.loginOAuth2Service.login();
        } else {
          this.router.navigate(['/login']);
        }
      });
  }

  populateDashboard(): void {
    this.applicationsService
      .findAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(discovery => {
        this.backend = discovery.backend;
        this.appInstances = [];
        discovery.applications.forEach(application =>
          application.instances.forEach(instance => {
            instance.name = application.name;
            this.appInstances.push(instance);
          })
        );
        this.populateStatus();
      });

    this.healthService
      .checkHealth()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: health => {
          this.health = health;
          this.updatingHealth = false;
        },
        error: health => {
          this.health = health;
          this.updatingHealth = false;
        },
      });
  }

  /**
   * The status of the Registry is only provided by its embedded Eureka server.
   */
  populateStatus(): void {
    if (this.backend !== 'eureka') {
      this.status = undefined;
      return;
    }
    this.eurekaStatusService
      .findAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => (this.status = data.status));
  }

  getBadgeClass(statusState: HealthStatus): string {
    if (statusState === 'UP') {
      return 'bg-success';
    } else {
      return 'bg-danger';
    }
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
    this.subscription?.unsubscribe();
  }
}
