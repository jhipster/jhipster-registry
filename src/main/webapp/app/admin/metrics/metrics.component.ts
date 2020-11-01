import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { Metrics, MetricsKey, MetricsService, Thread, ThreadDump } from './metrics.service';
import { Route } from 'app/shared/routes/route.model';
import { RoutesService } from 'app/shared/routes/routes.service';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-metrics',
  templateUrl: './metrics.component.html',
})
export class MetricsComponent implements OnInit, OnDestroy {
  metrics?: Metrics;
  threads?: Thread[];
  updatingMetrics = true;

  activeRoute?: Route;
  unsubscribe$ = new Subject();

  constructor(private metricsService: MetricsService, private changeDetector: ChangeDetectorRef, private routesService: RoutesService) {}

  ngOnInit(): void {
    this.routesService.routeChanged$.pipe(takeUntil(this.unsubscribe$)).subscribe(route => {
      this.activeRoute = route;
      this.refreshActiveRouteMetrics();
    });
  }

  refresh(): void {
    this.routesService.reloadRoutes();
  }

  refreshActiveRouteMetrics(): void {
    if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
      this.updatingMetrics = true;
      this.metricsService
        .getInstanceMetrics(this.activeRoute)
        .pipe(
          takeUntil(this.unsubscribe$),
          switchMap((metrics: Metrics) =>
            this.metricsService.instanceThreadDump(this.activeRoute).pipe(
              takeUntil(this.unsubscribe$),
              map((threadDump: ThreadDump) => {
                this.metrics = metrics;
                this.threads = threadDump.threads;
                this.updatingMetrics = false;
                this.changeDetector.detectChanges();
              })
            )
          )
        )
        .subscribe({
          error: error => {
            if (error.status === 500 || error.status === 404) {
              this.routesService.routeDown(this.activeRoute);
            }
          },
        });
    } else {
      this.routesService.routeDown(this.activeRoute);
    }
  }

  metricsKeyExists(key: MetricsKey): boolean {
    return this.metrics && this.metrics[key];
  }

  metricsKeyExistsAndObjectNotEmpty(key: MetricsKey): boolean {
    return this.metrics && this.metrics[key] && JSON.stringify(this.metrics[key]) !== '{}';
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
