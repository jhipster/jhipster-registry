import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { JhiHealthService } from './health.service';
import { JhiHealthModalComponent } from './health-modal.component';

import { JhiRoutesService, Route } from '../../shared';

@Component({
    selector: 'jhi-health',
    templateUrl: './health.component.html',
    styleUrls: [
        'health.component.css'
    ]
})
export class JhiHealthCheckComponent implements OnInit {
    healthData: any;
    updatingHealth: boolean;
    activeRoute: Route;
    routes: Route[];
    updatingRoutes: boolean;

    constructor(
        private modalService: NgbModal,
        private healthService: JhiHealthService,
        private routesService: JhiRoutesService
    ) {}

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
            this.displayActiveRouteHealth();
        });
    }

    displayActiveRouteHealth() {
        this.updatingHealth = true;
        if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
            this.healthService.checkInstanceHealth(this.activeRoute).subscribe((health) => {
                this.healthData = this.healthService.transformHealthData(health);
                this.updatingHealth = false;
            }, (error) => {
                if (error.status === 503 || error.status === 500 || error.status === 404) {
                    this.healthData = this.healthService.transformHealthData(error.json());
                    this.updatingHealth = false;
                    if (error.status === 500 || error.status === 404) {
                        this.downRoute(this.activeRoute);
                        this.setActiveRoute(null);
                        this.updateChosenInstance(this.activeRoute);
                        this.displayActiveRouteHealth();
                    }
                }
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

    // user click
    showRoute(instance: Route) {
        this.setActiveRoute(instance);
        this.refresh();
    }

    // change active route only if exists, else choose Registry
    setActiveRoute(instance: Route) {
        if (instance && this.routes && this.routes.findIndex((r) => r.appName === instance.appName) !== -1) {
            this.activeRoute = instance;
        } else if (this.routes && this.routes.length > 0) {
            this.activeRoute = this.routes[0];
        }
    }

    // user click
    showHealthModal(health: any) {
        const modalRef = this.modalService.open(JhiHealthModalComponent);
        modalRef.componentInstance.currentHealth = health;
        modalRef.result.then((result) => {
            // Left blank intentionally, nothing to do here
        }, (reason) => {
            // Left blank intentionally, nothing to do here
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

    baseName(name: string) {
        return this.healthService.getBaseName(name);
    }

    // user click
    getBadgeClassRoute(route: Route) {
        if (route && !route.status) {
            route.status = 'UP';
        }
        return this.getBadgeClass(route.status);
    }

    // user click
    getBadgeClass(statusState) {
        if (!statusState || statusState !== 'UP') {
            return 'badge-danger';
        } else {
            return 'badge-success';
        }
    }

    subSystemName(name: string) {
        return this.healthService.getSubSystemName(name);
    }

}
