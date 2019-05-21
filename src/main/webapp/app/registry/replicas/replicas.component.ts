import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiReplicasService } from './replicas.service';
import { JhiRefreshService } from 'app/shared/refresh/refresh.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'jhi-replicas',
    templateUrl: './replicas.component.html',
    styleUrls: ['replicas.component.scss']
})
export class JhiReplicasComponent implements OnInit, OnDestroy {
    showMore: boolean;
    replicas: any;

    refreshReloadSubscription: Subscription;

    constructor(private replicasService: JhiReplicasService, private refreshService: JhiRefreshService) {
        this.showMore = true;
    }

    ngOnInit() {
        this.refreshReloadSubscription = this.refreshService.refreshReload$.subscribe(empty => this.refresh());
        this.refresh();
    }

    ngOnDestroy() {
        this.refreshReloadSubscription.unsubscribe();
    }

    refresh() {
        this.replicasService.findAll().subscribe(replicas => {
            this.replicas = replicas;
        });
    }
}
