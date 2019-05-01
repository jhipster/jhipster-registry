import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { JhiConfigurationService } from './configuration.service';
import { JhiRoutesService, Route } from 'app/shared';

@Component({
    selector: 'jhi-configuration',
    templateUrl: './configuration.component.html'
})
export class JhiConfigurationComponent implements OnInit, OnDestroy {
    allConfiguration: any = null;
    configuration: any = null;
    configKeys: any[];
    filter: string;
    orderProp: string;
    reverse: boolean;

    activeRoute: Route;
    subscription: Subscription;
    updatingConfig: boolean;

    constructor(private configurationService: JhiConfigurationService, private routesService: JhiRoutesService) {
        this.configKeys = [];
        this.filter = '';
        this.orderProp = 'prefix';
        this.reverse = false;
    }

    keys(dict): Array<string> {
        return dict === undefined ? [] : Object.keys(dict);
    }

    ngOnInit() {
        this.subscription = this.routesService.routeChanged$.subscribe(route => {
            this.activeRoute = route;
            this.displayActiveRouteConfig();
        });
    }

    displayActiveRouteConfig() {
        this.updatingConfig = true;
        if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
            this.configurationService.getInstanceConfigs(this.activeRoute).subscribe(configuration => {
                    this.configuration = configuration;
                    this.updatingConfig = false;
                    for (const config of configuration) {
                        if (config.properties !== undefined) {
                            this.configKeys.push(Object.keys(config.properties));
                        }
                    }
                }, error => {
                    this.updatingConfig = false;
                    this.routesService.routeDown(this.activeRoute);
                }
            );

            this.configurationService.getInstanceEnv(this.activeRoute).subscribe(configuration => {
                this.allConfiguration = configuration;
            });
        } else {
            this.routesService.routeDown(this.activeRoute);
        }
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.subscription.unsubscribe();
    }
}
