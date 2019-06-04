import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Log } from './log.model';
import { LogsService } from './logs.service';

import { JhiRoutesService, Route } from 'app/shared';

@Component({
    selector: 'jhi-logs',
    templateUrl: './logs.component.html'
})
export class LogsComponent implements OnInit, OnDestroy {
    loggers: Log[];
    updatingLogs: boolean;
    filter: string;
    orderProp: string;
    reverse: boolean;

    activeRoute: Route;
    subscription: Subscription;

    constructor(private logsService: LogsService, private routesService: JhiRoutesService) {
        this.filter = '';
        this.orderProp = 'name';
        this.reverse = false;
    }

    ngOnInit() {
        this.loggers = [];
        this.subscription = this.routesService.routeChanged$.subscribe(route => {
            this.activeRoute = route;
            this.displayActiveRouteLogs();
        });
    }

    changeLevel(name: string, level: string) {
        if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
            this.logsService.changeInstanceLevel(this.activeRoute, name, level).subscribe(() => {
                this.logsService.findInstanceAll(this.activeRoute).subscribe(response => this.extractLoggers(response));
            });
        }
    }

    private extractLoggers(response) {
      this.loggers = Object.entries(response.body.loggers)
        .map(e => new Log(e[0], e[1]['effectiveLevel']));
    }

    displayActiveRouteLogs() {
        this.updatingLogs = true;
        if (this.activeRoute && this.activeRoute.status !== 'DOWN') {
            this.logsService.findInstanceAll(this.activeRoute).subscribe(response => {
                    this.extractLoggers(response);
                    this.updatingLogs = false;
                }, error => {
                    if (error.status === 503 || error.status === 500 || error.status === 404) {
                        this.updatingLogs = false;
                        if (error.status === 500 || error.status === 404) {
                            this.routesService.routeDown(this.activeRoute);
                        }
                    }
                }
            );
        } else {
            this.routesService.routeDown(this.activeRoute);
        }
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.subscription.unsubscribe();
    }
}
