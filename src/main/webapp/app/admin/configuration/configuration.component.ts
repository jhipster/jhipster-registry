import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { JhiConfigurationService } from './configuration.service';
import { Route } from 'app/shared/routes/route.model';
import { JhiRoutesService } from 'app/shared/routes/routes.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-configuration',
  templateUrl: './configuration.component.html'
})
export class JhiConfigurationComponent implements OnInit, OnDestroy {
  allConfiguration: any = null;
  configuration: any = null;
  configKeys: any[];
  filter: string;
  orderProp: string;
  reverse: boolean;

  activeRoute: Route;
  updatingConfig: boolean;
  unsubscribe$ = new Subject();

  constructor(private configurationService: JhiConfigurationService, private routesService: JhiRoutesService) {
    this.configKeys = [];
    this.filter = '';
    this.orderProp = 'prefix';
    this.reverse = false;
  }

  keys(dict): Array<string> {
    return dict === undefined ? [] : Object.keys(dict);
  }

  ngOnInit() {
    this.routesService.routeChanged$.pipe(takeUntil(this.unsubscribe$)).subscribe(route => {
      this.activeRoute = route;
      this.refreshActiveRouteConfig();
    });
  }

  refreshActiveRouteConfig() {
    this.updatingConfig = true;
    if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
      this.configurationService
        .getInstanceConfigs(this.activeRoute)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          configuration => {
            this.configuration = configuration;
            this.updatingConfig = false;
            for (const config of configuration) {
              if (config.properties !== undefined) {
                this.configKeys.push(Object.keys(config.properties));
              }
            }
          },
          () => {
            this.updatingConfig = false;
            this.routesService.routeDown(this.activeRoute);
          }
        );

      this.configurationService
        .getInstanceEnv(this.activeRoute)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(configuration => (this.allConfiguration = configuration));
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
