import {Component, OnInit} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

import {JhiHealthService} from "./health.service";
import {JhiHealthModalComponent} from "./health-modal.component";

import {JhiRoutesService} from "../../routes";
import {Route} from "../../routes/route.model";

@Component({
    selector: 'jhi-health',
    templateUrl: './health.component.html',
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
        this.displayActiveRouteHealth();
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
        });
    }

    displayActiveRouteHealth() {
        this.updatingHealth = true;
        this.healthService.checkInstanceHealth(this.activeRoute).subscribe(health => {
            this.healthData = this.healthService.transformHealthData(health);
            this.updatingHealth = false;
        }, error => {
            if (error.status === 503) {
                this.healthData = this.healthService.transformHealthData(error.json());
                this.updatingHealth = false;
            }
        });
    }

    updateChosenInstance(instance: Route) {
        if (instance) {
            this.activeRoute = instance;
            for (let route of this.routes) {
                route.active = '';
                if (route.appName === this.activeRoute.appName) {
                    route.active = 'active';
                }
            }
        }
    }

    // user click
    showRoute(instance: Route) {
        this.updateChosenInstance(instance);
        this.displayActiveRouteHealth();
    }

    // user click
    showHealthModal(health: any) {
        const modalRef  = this.modalService.open(JhiHealthModalComponent);
        modalRef.componentInstance.currentHealth = health;
        modalRef.result.then((result) => {
            // Left blank intentionally, nothing to do here
        }, (reason) => {
            // Left blank intentionally, nothing to do here
        });
    }

    baseName(name: string) {
        return this.healthService.getBaseName(name);
    }

    getTagClass(statusState) {
        if (statusState === 'UP') {
            return 'label-success';
        } else {
            return 'label-danger';
        }
    }

    subSystemName(name: string) {
        return this.healthService.getSubSystemName(name);
    }

}
