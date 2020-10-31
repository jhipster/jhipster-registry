import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoutesService } from './routes.service';
import { InstanceStatus, Route } from './route.model';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { RefreshService } from 'app/shared/refresh/refresh.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-route-selector',
  templateUrl: './route-selector.component.html',
  styleUrls: ['route-selector.component.scss'],
})
export class RouteSelectorComponent implements OnInit, OnDestroy {
  activeRoute?: Route;
  routes?: Route[];
  savedRoutes?: Route[];
  updatingRoutes?: boolean;
  searchedInstance = '';

  unSubscribe$ = new Subject();

  constructor(private routesService: RoutesService, private refreshService: RefreshService) {}

  ngOnInit(): void {
    this.activeRoute = this.routesService.getSelectedInstance();

    this.updateRoute();
    this.refreshService.refreshReload$.pipe(takeUntil(this.unSubscribe$)).subscribe(() => this.updateRoute());
    this.routesService.routeReload$.pipe(takeUntil(this.unSubscribe$)).subscribe(() => this.updateRoute());
    this.routesService.routeDown$.pipe(takeUntil(this.unSubscribe$)).subscribe(route => {
      this.downRoute(route);
      this.setActiveRoute(null);
    });
  }

  ngOnDestroy(): void {
    /** prevent memory leak when component destroyed **/
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  /** Change active route only if exists, else choose Registry **/
  setActiveRoute(instance: Route | null): void {
    if (instance && this.routes && this.routes.findIndex(r => r.appName === instance.appName) !== -1) {
      this.activeRoute = instance;
    } else if (this.routes && this.routes.length > 0) {
      this.activeRoute = this.routes[0];
    }
    this.routesService.storeSelectedInstance(this.activeRoute);
    this.routesService.routeChange(this.activeRoute);
  }

  private updateRoute(): void {
    this.updatingRoutes = true;
    this.routesService
      .findAll()
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe(
        routes => {
          this.savedRoutes = routes;
          this.routes = routes;
          this.searchedInstance = '';

          if (this.activeRoute) {
            /** in case of new refresh call **/
            this.setActiveRoute(this.activeRoute);
          } else if (routes.length > 0) {
            this.setActiveRoute(routes[0]);
          }
          this.updatingRoutes = false;
          this.routesService.routesChange(routes);
        },
        error => {
          if (error.status === 503 || error.status === 500 || error.status === 404) {
            if (error.status === 500 || error.status === 404) {
              this.downRoute(this.activeRoute);
              this.setActiveRoute(null);
            }
            this.updatingRoutes = false;
          }
        }
      );
  }

  private downRoute(instance: Route | undefined): void {
    if (instance) {
      instance.status = 'DOWN';
    }
  }

  /* ==========================================================================
                                      UI PART
   ========================================================================== */

  getActiveRoute(): string | undefined {
    return this.activeRoute!.serviceId ? this.activeRoute!.serviceId.toUpperCase() : this.activeRoute!.appName.toUpperCase();
  }

  getBadgeClassRoute(route: Route): string | string[] | Set<string> | { [klass: string]: any } {
    if (route && !route.status) {
      route.status = 'UP';
    }
    return this.getBadgeClass(route.status);
  }

  private getBadgeClass(statusState: InstanceStatus): string | string[] | Set<string> | { [klass: string]: any } {
    if (statusState && (statusState === 'UP' || statusState.toLowerCase() === 'starting')) {
      return 'badge-success';
    } else {
      return 'badge-danger';
    }
  }

  state(route: Route): string | string[] | Set<string> | { [klass: string]: any } {
    if (route && route.status && route.status === 'DOWN') {
      return 'disabled';
    } else if (route && route.serviceId === this.activeRoute!.serviceId) {
      return 'active';
    }
    return '';
  }

  searchByAppName(): void {
    if (this.searchedInstance === '') {
      this.routes = this.savedRoutes;
    } else {
      this.routes = this.savedRoutes!.filter(route => {
        return route.appName.includes(this.searchedInstance);
      });
    }
  }

  /**
   * Close the dropdown element.
   * The dropdown can be closed directly in the HTML, but cause the warning
   * ("The method "drop" that you're trying to access does not exist in the class declaration.").
   * @param dropdown
   */
  closeDropDown(dropdown: NgbDropdown): void {
    if (dropdown) {
      dropdown.close();
    }
  }
}
