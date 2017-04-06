import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {JhiMetricsMonitoringModalComponent} from './metrics-modal.component';
import {JhiMetricsService} from './metrics.service';

import {JhiRoutesService} from '../../routes';
import {Route} from '../../routes/route.model';

@Component({
    selector: 'jhi-metrics',
    templateUrl: './metrics.component.html',
    styleUrls: [
        'metrics.component.css'
    ]
})
export class JhiMetricsMonitoringComponent implements OnInit {
    metrics: any = {};
    cachesStats: any = {};
    servicesStats: any = {};
    updatingMetrics = true;
    JCACHE_KEY: string;

    activeRoute: Route;
    routes: Route[];
    updatingRoutes: boolean;

    constructor(
        private modalService: NgbModal,
        private metricsService: JhiMetricsService,
        private routesService: JhiRoutesService
    ) {
        this.JCACHE_KEY = 'jcache.statistics';
    }

    ngOnInit() {
        this.refresh();
    }

    refresh () {
        this.getRoutes();
    }

    displayActiveRouteMetrics() {
        this.updatingMetrics = true;
        if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
            this.metricsService.getInstanceMetrics(this.activeRoute).subscribe((metrics) => {
                this.metrics = metrics;
                this.updatingMetrics = false;
                this.servicesStats = {};
                this.cachesStats = {};
                Object.keys(metrics.timers).forEach((key) => {
                    let value = metrics.timers[key];
                    if (key.indexOf('web.rest') !== -1 || key.indexOf('service') !== -1) {
                        this.servicesStats[key] = value;
                    }
                });
                Object.keys(metrics.gauges).forEach((key) => {
                    if (key.indexOf('jcache.statistics') !== -1) {
                        let value = metrics.gauges[key].value;
                        // remove gets or puts
                        let index = key.lastIndexOf('.');
                        let newKey = key.substr(0, index);

                        // Keep the name of the domain
                        this.cachesStats[newKey] = {
                            'name': this.JCACHE_KEY.length,
                            'value': value
                        };
                    }
                });
            }, error => {
                if (error.status === 503 || error.status === 500 || error.status === 404) {
                    if (error.status === 500 || error.status === 404) {
                        this.downRoute(this.activeRoute);
                        this.setActiveRoute(null);
                        this.updateChosenInstance(this.activeRoute);
                        this.displayActiveRouteMetrics();
                    }
                }
            });
        }
    }

    refreshThreadDumpData () {
        this.metricsService.instanceThreadDump(this.activeRoute).subscribe((data) => {
            const modalRef  = this.modalService.open(JhiMetricsMonitoringModalComponent, { size: 'lg'});
            modalRef.componentInstance.threadDump = data;
            modalRef.result.then((result) => {
                // Left blank intentionally, nothing to do here
            }, (reason) => {
                // Left blank intentionally, nothing to do here
            });
        });
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
            this.displayActiveRouteMetrics();
        });
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

    // user click
    showRoute(instance: Route) {
        this.setActiveRoute(instance);
        this.refresh();
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

    // user click
    getLabelClass(statusState) {
        if (!statusState || statusState !== 'UP') {
            return 'label-danger';
        } else {
            return 'label-success';
        }
    }

}
