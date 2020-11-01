import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { Bean, ConfigurationService, PropertySource } from './configuration.service';
import { Route } from 'app/shared/routes/route.model';
import { RoutesService } from 'app/shared/routes/routes.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-configuration',
  templateUrl: './configuration.component.html',
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  allBeans!: Bean[];
  beans: Bean[] = [];
  beansFilter = '';
  beansAscending = true;
  propertySources: PropertySource[] = [];

  activeRoute?: Route;
  updatingConfig?: boolean;
  unsubscribe$ = new Subject();

  constructor(private configurationService: ConfigurationService, private routesService: RoutesService) {}

  ngOnInit(): void {
    this.routesService.routeChanged$.pipe(takeUntil(this.unsubscribe$)).subscribe(route => {
      this.activeRoute = route;
      this.refreshActiveRouteBeans();
    });
  }

  refreshActiveRouteBeans(): void {
    this.updatingConfig = true;
    if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
      this.configurationService
        .getInstanceBeans(this.activeRoute)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          beans => {
            this.allBeans = beans;
            this.filterAndSortBeans();
          },
          () => {
            this.updatingConfig = false;
            this.routesService.routeDown(this.activeRoute);
          }
        );

      this.configurationService
        .getInstancePropertySources(this.activeRoute)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(propertySources => (this.propertySources = propertySources));
    } else {
      this.routesService.routeDown(this.activeRoute);
    }
  }

  filterAndSortBeans(): void {
    this.beans = this.allBeans
      .filter(bean => !this.beansFilter || bean.prefix.toLowerCase().includes(this.beansFilter.toLowerCase()))
      .sort((a, b) => (a.prefix < b.prefix ? (this.beansAscending ? -1 : 1) : this.beansAscending ? 1 : -1));
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
