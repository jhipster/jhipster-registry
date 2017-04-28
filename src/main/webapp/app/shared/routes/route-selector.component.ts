import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { JhiRoutesService } from './routes.service';
import { Route } from './route.model';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'jhi-route-selector',
    templateUrl: './route-selector.component.html',
    styleUrls: [
        'route-selector.component.scss'
    ]
})
export class JhiRouteSelectorComponent implements OnInit, OnDestroy {

    activeRoute: Route;
    routes: Route[];
    savedRoutes: Route[];
    updatingRoutes: boolean;
    searchedInstance = '';
    routeReloadSubscription: Subscription;
    routeDownSubscription: Subscription;

    activeRefreshTime: number;
    refreshTimes: number[];
    refreshTimer: Subscription;

    constructor(
        private routesService: JhiRoutesService,
    ) {
        this.refreshTimes = [0, 5, 10, 30, 60, 300];
        this.activeRefreshTime = this.refreshTimes[0];
    }

    ngOnInit() {
        this.activeRoute = this.routesService.getSelectedInstance();
        this.activeRefreshTime = this.routesService.getSelectedRefreshTime();

        this.updateRoute();
        this.routeReloadSubscription = this.routesService.routeReload$.subscribe((reload) => this.updateRoute());
        this.routeDownSubscription = this.routesService.routeDown$.subscribe((route) => {
            this.downRoute(route);
            this.setActiveRoute(null);
        });

        this.launchTimer(false);
    }

    ngOnDestroy() {
        /** prevent memory leak when component destroyed **/
        this.routeReloadSubscription.unsubscribe();
        this.routeDownSubscription.unsubscribe();
        if (this.refreshTimer) {
            this.refreshTimer.unsubscribe();
        }
    }

    /** Change active route only if exists, else choose Registry **/
    setActiveRoute(instance: Route) {
        if (instance && this.routes && this.routes.findIndex((r) => r.appName === instance.appName) !== -1) {
            this.activeRoute = instance;
        } else if (this.routes && this.routes.length > 0) {
            this.activeRoute = this.routes[0];
        }
        this.routesService.storeSelectedInstance(this.activeRoute);
        this.routesService.routeChange(this.activeRoute);
    }

    private updateRoute() {
        this.updatingRoutes = true;
        this.routesService.findAll().subscribe((routes) => {
            this.savedRoutes = routes;
            this.routes = routes;
            this.searchedInstance = '';

            if (this.activeRoute) { /** in case of new refresh call **/
                this.setActiveRoute(this.activeRoute);
            } else if (routes.length > 0) {
                this.setActiveRoute(routes[0]);
            }
            this.updatingRoutes = false;
        }, (error) => {
            if (error.status === 503 || error.status === 500 || error.status === 404) {
                if (error.status === 500 || error.status === 404) {
                    this.downRoute(this.activeRoute);
                    this.setActiveRoute(null);
                }
                this.updatingRoutes = false;
            }
        });
    }

    private downRoute(instance: Route) {
        if (instance) {
            instance.status = 'DOWN';
        }
    }

    /** Change active time only if exists, else 0 **/
    setActiveRefreshTime(time: number) {
        if (time && this.refreshTimes.findIndex((t) => t === time) !== -1) {
            this.activeRefreshTime = time;
        } else {
            this.activeRefreshTime = this.refreshTimes[0];
        }
        this.routesService.storeSelectedRefreshTime(time);
        this.launchTimer(true);
    }

    /** Init the timer **/
    subscribe() {
        if (this.activeRefreshTime && this.activeRefreshTime > 0) {
            this.refreshTimer = Observable.interval(this.activeRefreshTime * 1000).subscribe(() => {
                this.updateRoute();
            });
        }
    }

    /** Launch (or relaunch if true) the timer. **/
    launchTimer(relaunch: boolean) {
        if (relaunch && this.refreshTimer) {
            this.refreshTimer.unsubscribe();
        }
        this.subscribe();
    }

    /* ==========================================================================
                                        UI PART
     ========================================================================== */

    getActiveRoute() {
        return this.activeRoute.serviceId ? this.activeRoute.serviceId.toUpperCase() : this.activeRoute.appName.toUpperCase();
    }

    getBadgeClassRoute(route: Route) {
        if (route && !route.status) {
            route.status = 'UP';
        }
        return this.getBadgeClass(route.status);
    }

    private getBadgeClass(statusState) {
        if (!statusState || statusState !== 'UP') {
            return 'badge-danger';
        } else {
            return 'badge-success';
        }
    }

    state(route: Route) {
        if (route && route.status && route.status === 'DOWN') {
            return 'disabled';
        } else if (route && route.serviceId === this.activeRoute.serviceId) {
            return 'active';
        }
    }

    searchByAppName() {
        if (this.searchedInstance === '') {
            this.routes = this.savedRoutes;
        } else {
            this.routes = this.savedRoutes.filter((route) => {
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
    closeDropDown(dropdown: NgbDropdown) {
        if (dropdown) {
            dropdown.close();
        }
    }

    getActiveRefreshTime(): string {
        if (this.activeRefreshTime <= 0) {
            return 'disabled';
        }
        return this.activeRefreshTime + ' sec.';
    }

    classTime(): string {
        if (this.activeRefreshTime <= 0) {
            return 'fa-pause';
        }
        return 'fa-refresh';
    }

    stateTime(time: number): string {
        if (time === this.activeRefreshTime) {
            return 'active';
        }
    }

}
