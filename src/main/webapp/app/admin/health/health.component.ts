import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { JhiHealthService } from './health.service';
import { JhiHealthModalComponent } from './health-modal.component';
import { Route } from 'app/shared/routes/route.model';
import { JhiRoutesService } from 'app/shared/routes/routes.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-health',
  templateUrl: './health.component.html'
})
export class JhiHealthCheckComponent implements OnInit, OnDestroy {
  healthData: any;
  updatingHealth: boolean;
  activeRoute: Route;
  unsubscribe$ = new Subject();

  constructor(private modalService: NgbModal, private healthService: JhiHealthService, private routesService: JhiRoutesService) {}

  ngOnInit() {
    this.routesService.routeChanged$.pipe(takeUntil(this.unsubscribe$)).subscribe(route => {
      this.activeRoute = route;
      this.refreshActiveRouteHealth();
    });
  }

  refreshActiveRouteHealth() {
    this.updatingHealth = true;
    if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
      this.healthService
        .checkInstanceHealth(this.activeRoute)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          health => {
            this.healthData = this.healthService.transformHealthData(health);
            this.updatingHealth = false;
          },
          error => {
            if (error.status === 503 || error.status === 500 || error.status === 404) {
              this.healthData = this.healthService.transformHealthData(error.error);
              this.updatingHealth = false;
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

  // user click
  showHealth(health: any) {
    const modalRef = this.modalService.open(JhiHealthModalComponent);
    modalRef.componentInstance.currentHealth = health;
    modalRef.result.then(
      () => {
        // Left blank intentionally, nothing to do here
      },
      () => {
        // Left blank intentionally, nothing to do here
      }
    );
  }

  baseName(name: string) {
    return this.healthService.getBaseName(name);
  }

  // user click
  getBadgeClass(statusState) {
    if (!statusState || statusState !== 'UP') {
      return 'badge-danger';
    } else {
      return 'badge-success';
    }
  }

  subSystemName(name: string) {
    return this.healthService.getSubSystemName(name);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
