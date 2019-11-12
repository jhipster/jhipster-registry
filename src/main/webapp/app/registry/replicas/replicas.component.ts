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
  unsubscribe$ = new Subject();

  constructor(private replicasService: JhiReplicasService, private refreshService: JhiRefreshService) {
    this.showMore = true;
  }

  ngOnInit() {
    this.refreshService.refreshReload$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.refresh());
    this.refresh();
  }

  refresh() {
    this.replicasService
      .findAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(replicas => (this.replicas = replicas));
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
