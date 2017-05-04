import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { JhiHistoryService } from './history.service';
import { JhiRefreshService } from '../../shared/refresh/refresh.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'jhi-history',
    templateUrl: './history.component.html'
})
export class JhiHistoryComponent implements OnInit, OnDestroy {
    items: any;
    data: any;

    refreshReloadSubscription: Subscription;

    constructor(
        private historyService: JhiHistoryService,
        private refreshService: JhiRefreshService
    ) {}

    ngOnInit() {
        this.refreshReloadSubscription = this.refreshService.refreshReload$.subscribe((empty) => this.refresh());
        this.refresh();
    }

    ngOnDestroy() {
        this.refreshReloadSubscription.unsubscribe();
    }

    refresh() {
        this.historyService.findAll().subscribe((data) => {
            this.data = data;
            this.activate('registered');
        });
    }

    activate(key: string) {
        this.items = [];
        const obj = this.data ? this.data[key] : null;
        if (obj) {
            for (const k of Object.keys(obj)) {
                this.items.push({key: k, value: obj[k]});
            }
        }
    }

    beforeChange($event: NgbTabChangeEvent) {
        this.activate($event.nextId);
    };
}
