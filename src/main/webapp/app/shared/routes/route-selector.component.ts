import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { JhiRoutesService } from './routes.service';
import { Route } from './route.model';

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
    updatingRoutes: boolean;
    routeReloadSubscription: Subscription;
    routeDownSubscription: Subscription;

    constructor(
        private routesService: JhiRoutesService
    ) {
    }

    ngOnInit() {
        this.getRoutes();
        this.routeReloadSubscription = this.routesService.routeReload$.subscribe((reload) => this.getRoutes());
        this.routeDownSubscription = this.routesService.routeDown$.subscribe((route) => {
            this.downRoute(route);
            this.setActiveRoute(null);
            this.updateChosenInstance(route);
        });
    }

    getRoutes() {
        this.updateRoute(true);
    }

    updateChosenInstance(instance: Route) {
        if (instance) {
            this.setActiveRoute(instance);
            for (const route of this.routes) {
                route.active = '';
                if (route.path === this.activeRoute.path) {
                    route.active = 'active';
                }
            }
        }
    }

    // change active route only if exists, else choose Registry
    setActiveRoute(instance: Route) {
        if (instance && this.routes && this.routes.findIndex((r) => r.appName === instance.appName) !== -1) {
            this.activeRoute = instance;
        } else if (this.routes && this.routes.length > 0) {
            this.activeRoute = this.routes[0];
        }
        this.routesService.routeChange(this.activeRoute);
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.routeReloadSubscription.unsubscribe();
    }

    private updateRoute(updateInstance: boolean) {
        this.updatingRoutes = true;
        this.routesService.findAll().subscribe((routes) => {
            this.routes = routes;
            if (updateInstance) {
                if (this.activeRoute) { // in case of new refresh call
                    this.updateChosenInstance(this.activeRoute);
                } else if (routes.length > 0) {
                    this.updateChosenInstance(routes[0]);
                }
            }
            this.updatingRoutes = false;
        }, (error) => {
            if (error.status === 503 || error.status === 500 || error.status === 404) {
                if (error.status === 500 || error.status === 404) {
                    this.downRoute(this.activeRoute);
                    this.setActiveRoute(null);
                    if (updateInstance) {
                        this.updateChosenInstance(this.activeRoute);
                    }
                }
                this.updatingRoutes = false;
            }
        });
    }

    private downRoute(instance: Route) {
        if (instance && this.routes) {
            const index = this.routes.findIndex((r) => r.appName === instance.appName);
            if (index !== -1) {
                this.routes[index].status = 'DOWN';
            }
        }
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
        } else if (route && route === this.activeRoute) {
            return 'active';
        }
    }

}
