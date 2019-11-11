import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JhiReplicasService } from './replicas.service';
import { JhiRefreshService } from 'app/shared/refresh/refresh.service';

@Component({
  selector: 'jhi-replicas',
  templateUrl: './replicas.component.html',
  styleUrls: ['replicas.component.scss']
})
export class JhiReplicasComponent implements OnInit, OnDestroy {
  showMore: boolean;
  replicas: any;

  unSubscribe$ = new Subject();

  constructor(private replicasService: JhiReplicasService, private refreshService: JhiRefreshService) {
    this.showMore = true;
  }

  ngOnInit() {
    this.refreshService.refreshReload$.pipe(takeUntil(this.unSubscribe$)).subscribe(() => this.refresh());
    this.refresh();
  }

  ngOnDestroy() {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  refresh() {
    this.replicasService
      .findAll()
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe(replicas => {
        this.replicas = replicas;
      });
  }
}
