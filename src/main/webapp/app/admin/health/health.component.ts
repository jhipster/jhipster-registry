import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Health, HealthDetails, HealthKey, HealthStatus, HealthService } from './health.service';
import { HealthModalComponent } from './health-modal.component';
import { Route } from 'app/shared/routes/route.model';
import { RoutesService } from 'app/shared/routes/routes.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-health',
  templateUrl: './health.component.html',
})
export class HealthComponent implements OnInit, OnDestroy {
  health?: Health;
  activeRoute?: Route;
  unsubscribe$ = new Subject();

  constructor(private modalService: NgbModal, private healthService: HealthService, private routesService: RoutesService) {}

  ngOnInit(): void {
    this.routesService.routeChanged$.pipe(takeUntil(this.unsubscribe$)).subscribe(route => {
      this.activeRoute = route;
      this.refreshActiveRouteHealth();
    });
  }

  refreshActiveRouteHealth(): void {
    if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
      this.healthService
        .checkInstanceHealth(this.activeRoute)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          health => (this.health = health),
          error => {
            if (error.status === 503 || error.status === 500 || error.status === 404) {
              this.health = error.error;
              if (error.status === 500 || error.status === 404) {
                this.routesService.routeDown(this.activeRoute);
              }
            }
          }
        );
    } else {
      this.routesService.routeDown(this.activeRoute);
    }
  }

  getBadgeClass(statusState: HealthStatus): string {
    if (statusState === 'UP') {
      return 'badge-success';
    } else {
      return 'badge-danger';
    }
  }

  // user click
  showHealth(health: { key: HealthKey; value: HealthDetails }): void {
    const modalRef = this.modalService.open(HealthModalComponent);
    modalRef.componentInstance.health = health;
    modalRef.result.then(
      () => {
        // Left blank intentionally, nothing to do here
      },
      () => {
        // Left blank intentionally, nothing to do here
      }
    );
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
