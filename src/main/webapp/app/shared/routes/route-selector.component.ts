import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { JhiRoutesService } from './routes.service';
import { Route } from './route.model';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { JhiRefreshService } from '../refresh/refresh.service';

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

    refreshReloadSubscription: Subscription;

    constructor(
        private routesService: JhiRoutesService,
        private refreshService: JhiRefreshService
    ) {}

    ngOnInit() {
        this.activeRoute = this.routesService.getSelectedInstance();

        this.updateRoute();
        this.refreshReloadSubscription = this.refreshService.refreshReload$.subscribe((reload) => this.updateRoute());
        this.routeReloadSubscription = this.routesService.routeReload$.subscribe((reload) => this.updateRoute());
        this.routeDownSubscription = this.routesService.routeDown$.subscribe((route) => {
            this.downRoute(route);
            this.setActiveRoute(null);
        });
    }

    ngOnDestroy() {
        /** prevent memory leak when component destroyed **/
        this.routeReloadSubscription.unsubscribe();
        this.routeDownSubscription.unsubscribe();
        this.refreshReloadSubscription.unsubscribe();
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
        if (statusState && (statusState === 'UP' || statusState.toLowerCase() === 'starting')) {
            return 'badge-success';
        } else {
            return 'badge-danger';
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

}
