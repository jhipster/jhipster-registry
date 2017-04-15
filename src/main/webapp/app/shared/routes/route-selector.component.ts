import { Component, OnInit } from '@angular/core';

import { JhiRoutesService } from './routes.service';
import { Route } from './route.model';

@Component({
    selector: 'jhi-route--selector',
    templateUrl: './route-selector.component.html',
    styleUrls: [
        'route-selector.component.scss'
    ]
})
export class JhiRouteSelectorComponent implements OnInit {

    activeRoute: Route;
    routes: Route[];
    updatingRoutes: boolean;

    constructor(
        private routesService: JhiRoutesService
    ) {
    }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.getRoutes();
    }

    getRoutes() {
        this.updatingRoutes = true;
        this.routesService.findAll().subscribe((routes) => {
            this.routes = routes;
            this.updatingRoutes = false;

            if (this.activeRoute) { // in case of new refresh call
                this.updateChosenInstance(this.activeRoute);
            } else if (routes.length > 0) {
                this.updateChosenInstance(routes[0]);
            }
        });
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

    showRoute(instance: Route) {
        this.setActiveRoute(instance);
        this.getRoutes();
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

    private downRoute(instance: Route) {
        if (instance && this.routes) {
            const index = this.routes.findIndex((r) => r.appName === instance.appName);
            if (index !== -1) {
                this.routes[index].status = 'DOWN';
            }
        }
    }

    // user click
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

}
