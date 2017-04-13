import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { JhiHistoryService } from './history.service';

@Component({
    selector: 'jhi-history',
    templateUrl: './history.component.html',
})
export class JhiHistoryComponent implements OnInit {
    items: any;
    data: any;

    constructor(private historyService: JhiHistoryService) {}

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.historyService.findAll().toPromise().then((data) => {
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
