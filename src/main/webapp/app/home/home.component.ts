import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Health, HealthService, HealthStatus } from 'app/admin/health/health.service';

import { VERSION } from 'app/app.constants';
import { EurekaStatusKey, EurekaStatusService } from './eureka.status.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { LoginOAuth2Service } from 'app/shared/oauth2/login-oauth2.service';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { ApplicationsService, Instance } from 'app/registry/applications/applications.service';
import { RefreshService } from 'app/shared/refresh/refresh.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  account?: Account | null;
  updatingHealth?: boolean;
  health?: Health;
  appInstances: Array<Instance> = [];
  status?: {
    [key in EurekaStatusKey]?: any;
  };
  version: string = VERSION ? 'v' + VERSION : '';
  unsubscribe$ = new Subject();
  subscription?: Subscription;

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private loginOAuth2Service: LoginOAuth2Service,
    private eventManager: JhiEventManager,
    private eurekaStatusService: EurekaStatusService,
    private applicationsService: ApplicationsService,
    private healthService: HealthService,
    private profileService: ProfileService,
    private refreshService: RefreshService
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
          this.loginModalService.open();
        }
      });
  }

  populateDashboard(): void {
    this.eurekaStatusService
      .findAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => (this.status = data.status));

    this.applicationsService
      .findAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(applications => {
        this.appInstances = [];
        applications.forEach(application =>
          application.instances.forEach(instance => {
            instance.name = application.name;
            this.appInstances.push(instance);
          })
        );
      });

    this.healthService
      .checkHealth()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        health => {
          this.health = health;
          this.updatingHealth = false;
        },
        health => {
          this.health = health;
          this.updatingHealth = false;
        }
      );
  }

  getBadgeClass(statusState: HealthStatus): string {
    if (statusState === 'UP') {
      return 'badge-success';
    } else {
      return 'badge-danger';
    }
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.subscription!.unsubscribe();
  }
}
