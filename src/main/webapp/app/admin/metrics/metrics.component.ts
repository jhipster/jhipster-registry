import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { JhiMetricsMonitoringModalComponent } from './metrics-modal.component';
import { JhiMetricsService } from './metrics.service';
import { JhiRoutesService, Route } from '../../shared';

@Component({
    selector: 'jhi-metrics',
    templateUrl: './metrics.component.html',
})
export class JhiMetricsMonitoringComponent implements OnInit {
    metrics: any = {};
    cachesStats: any = {};
    servicesStats: any = {};
    updatingMetrics = true;
    JCACHE_KEY: string;

    activeRoute: Route;
    subscription: Subscription;

    constructor(
        private modalService: NgbModal,
        private metricsService: JhiMetricsService,
        private routesService: JhiRoutesService
    ) {
        this.JCACHE_KEY = 'jcache.statistics';
    }

    ngOnInit() {
        this.subscription = this.routesService.routeChanged$.subscribe((route) => {
            this.activeRoute = route;
            this.displayActiveRouteMetrics();
        });
    }

    refresh() {
        this.routesService.reloadRoutes();
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
                    const value = metrics.timers[key];
                    if (key.indexOf('web.rest') !== -1 || key.indexOf('service') !== -1) {
                        this.servicesStats[key] = value;
                    }
                });
                Object.keys(metrics.gauges).forEach((key) => {
                    if (key.indexOf('jcache.statistics') !== -1) {
                        const value = metrics.gauges[key].value;
                        // remove gets or puts
                        const index = key.lastIndexOf('.');
                        const newKey = key.substr(0, index);

                        // Keep the name of the domain
                        this.cachesStats[newKey] = {
                            'name': this.JCACHE_KEY.length,
                            'value': value
                        };
                    }
                });
            }, (error) => {
                if (error.status === 503 || error.status === 500 || error.status === 404) {
                    if (error.status === 500 || error.status === 404) {
                        this.routesService.routeDown(this.activeRoute);
                    }
                }
            });
        } else {
            this.routesService.routeDown(this.activeRoute);
        }
    }

    refreshThreadDumpData() {
        this.metricsService.instanceThreadDump(this.activeRoute).subscribe((data) => {
            const modalRef = this.modalService.open(JhiMetricsMonitoringModalComponent, {size: 'lg'});
            modalRef.componentInstance.threadDump = data;
            modalRef.result.then((result) => {
                // Left blank intentionally, nothing to do here
            }, (reason) => {
                // Left blank intentionally, nothing to do here
            });
        });
    }

    filterNaN(input) {
        if (isNaN(input)) {
            return 0;
        }
        return input;
    }

}
