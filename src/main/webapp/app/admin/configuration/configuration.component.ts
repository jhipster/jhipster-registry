import { Component, OnInit } from '@angular/core';

import { JhiConfigurationService } from './configuration.service';

import { JhiRoutesService } from '../../routes';
import { Route } from '../../routes/route.model';

@Component({
    selector: 'jhi-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: [
        'configuration.component.css'
    ]
})
export class JhiConfigurationComponent implements OnInit {
    allConfiguration: any = null;
    configuration: any = null;
    configKeys: any[];
    filter: string;
    orderProp: string;
    reverse: boolean;

    activeRoute: Route;
    routes: Route[];
    updatingRoutes: boolean;
    updatingConfig: boolean;

    constructor(
        private configurationService: JhiConfigurationService,
        private routesService: JhiRoutesService
    ) {
        this.configKeys = [];
        this.filter = '';
        this.orderProp = 'prefix';
        this.reverse = false;
    }

    keys(dict): Array<string> {
        return (dict === undefined) ? [] : Object.keys(dict);
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
            this.displayActiveRouteLogs();
        }, (error) => {
            if (error.status === 503 || error.status === 500 || error.status === 404) {
                this.updatingConfig = false;
                if (error.status === 500 || error.status === 404) {
                    this.downRoute(this.activeRoute);
                    this.setActiveRoute(null);
                    this.updateChosenInstance(this.activeRoute);
                    this.displayActiveRouteLogs();
                }
            }
        });
    }

    displayActiveRouteLogs() {
        this.updatingConfig = true;
        if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
            this.configurationService.getInstanceConfigs(this.activeRoute).subscribe((configuration) => {
                this.configuration = configuration;

                for (const config of configuration) {
                    if (config.properties !== undefined) {
                        this.configKeys.push(Object.keys(config.properties));
                    }
                }
            });

            this.configurationService.getInstanceEnv(this.activeRoute).subscribe((configuration) => {
                this.allConfiguration = configuration;
            });
        }
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
