import {Component, OnInit} from '@angular/core';

import {Log} from './log.model';
import {JhiLogsService} from './logs.service';

import {JhiRoutesService} from '../../routes';
import {Route} from '../../routes/route.model';

@Component({
    selector: 'jhi-logs',
    templateUrl: './logs.component.html',
    styleUrls: [
        'logs.component.css'
    ]
})
export class JhiLogsComponent implements OnInit {

    loggers: Log[];
    updatingLogs: boolean;
    filter: string;
    orderProp: string;
    reverse: boolean;

    activeRoute: Route;
    routes: Route[];
    updatingRoutes: boolean;

    constructor (
        private logsService: JhiLogsService,
        private routesService: JhiRoutesService
    ) {
        this.filter = '';
        this.orderProp = 'name';
        this.reverse = false;
    }

    ngOnInit() {
        this.getRoutes();
    }

    changeLevel (name: string, level: string) {
        let log = new Log(name, level);
        if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
            this.logsService.changeInstanceLevel(this.activeRoute, log).subscribe(() => {
                this.logsService.findInstanceAll(this.activeRoute).subscribe(loggers => this.loggers = loggers);
            });
        }
    }

    getRoutes() {
        this.updatingRoutes = true;
        this.routesService.findAll().subscribe(routes => {
            this.routes = routes;
            this.updatingRoutes = false;

            if (this.activeRoute) { // in case of new refresh call
                this.updateChosenInstance(this.activeRoute);
            } else if (routes.length > 0) {
                this.updateChosenInstance(routes[0]);
            }
            this.displayActiveRouteLogs();
        });
    }

    displayActiveRouteLogs() {
        this.updatingLogs = true;
        if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
            this.logsService.findInstanceAll(this.activeRoute).subscribe(loggers => {
                this.loggers = loggers;
                this.updatingLogs = false;
            }, error => {
                if (error.status === 503 || error.status === 500 || error.status === 404) {
                    this.updatingLogs = false;
                    if (error.status === 500 || error.status === 404) {
                        this.downRoute(this.activeRoute);
                        this.setActiveRoute(null);
                        this.updateChosenInstance(this.activeRoute);
                        this.displayActiveRouteLogs();
                    }
                }
            });
        }
    }

    updateChosenInstance(instance: Route) {
        if (instance) {
            this.setActiveRoute(instance);
            for (let route of this.routes) {
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
        if (instance && this.routes && this.routes.findIndex(r => r.appName === instance.appName) !== -1) {
            this.activeRoute = instance;
        } else if (this.routes && this.routes.length > 0) {
            this.activeRoute = this.routes[0];
        }
    }

    private downRoute(instance: Route) {
        if (instance && this.routes) {
            let index = this.routes.findIndex(r => r.appName === instance.appName);
            if (index !== -1) {
                this.routes[index].status = 'DOWN';
            }
        }
    }

    // user click
    getLabelClassRoute(route: Route) {
        if (route && !route.status) {
            route.status = 'UP';
        }
        return this.getLabelClass(route.status);
    }

    private getLabelClass(statusState) {
        if (!statusState || statusState !== 'UP') {
            return 'label-danger';
        } else {
            return 'label-success';
        }
    }

}
