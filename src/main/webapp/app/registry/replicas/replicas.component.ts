import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReplicasService } from './replicas.service';
import { RefreshService } from 'app/shared/refresh/refresh.service';

@Component({
  selector: 'jhi-replicas',
  templateUrl: './replicas.component.html',
  styleUrls: ['./replicas.component.scss'],
})
export class ReplicasComponent implements OnInit, OnDestroy {
  showMore = true;
  replicas?: Array<string>;
  unsubscribe$ = new Subject();

  constructor(private replicasService: ReplicasService, private refreshService: RefreshService) {}

  ngOnInit(): void {
    this.refreshService.refreshReload$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.refresh());
    this.refresh();
  }

  refresh(): void {
    this.replicasService
      .findAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(replicas => (this.replicas = replicas));
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
