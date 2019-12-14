import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Log } from './log.model';
import { LogsService } from './logs.service';
import { Route } from 'app/shared/routes/route.model';
import { JhiRoutesService } from 'app/shared/routes/routes.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-logs',
  templateUrl: './logs.component.html'
})
export class LogsComponent implements OnInit, OnDestroy {
  loggers: Log[];
  updatingLogs: boolean;
  filter: string;
  orderProp: string;
  reverse: boolean;

  activeRoute: Route;
  routes: Route[];
  unsubscribe$ = new Subject();

  constructor(private logsService: LogsService, private routesService: JhiRoutesService) {
    this.filter = '';
    this.orderProp = 'name';
    this.reverse = false;
  }

  ngOnInit() {
    this.loggers = [];
    this.routesService.routeChanged$.pipe(takeUntil(this.unsubscribe$)).subscribe(route => {
      this.activeRoute = route;
      this.refreshActiveRouteLogs();
    });

    this.routesService.routesChanged$.pipe(takeUntil(this.unsubscribe$)).subscribe(routes => (this.routes = routes));
  }

  changeLevel(name: string, level: string) {
    if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
      this.logsService
        .changeInstanceLevel(this.searchByAppName(), name, level)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.logsService.findInstanceAll(this.activeRoute).subscribe(response => this.extractLoggers(response));
        });
    }
  }

  searchByAppName() {
    return this.routes.filter(route => {
      return route.appName === this.activeRoute.appName;
    });
  }

  private extractLoggers(response) {
    this.loggers = Object.entries(response.body.loggers).map(e => new Log(e[0], e[1]['effectiveLevel']));
  }

  refreshActiveRouteLogs() {
    this.updatingLogs = true;
    if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
      this.logsService
        .findInstanceAll(this.activeRoute)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          response => {
            this.extractLoggers(response);
            this.updatingLogs = false;
          },
          error => {
            if (error.status === 503 || error.status === 500 || error.status === 404) {
              this.updatingLogs = false;
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

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
