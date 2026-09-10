import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReplicasService } from './replicas.service';
import { RefreshService } from 'app/shared/refresh/refresh.service';
import { EurekaStatusService } from 'app/home/eureka.status.service';

@Component({
  selector: 'jhi-replicas',
  templateUrl: './replicas.component.html',
  styleUrls: ['./replicas.component.scss'],
})
export class ReplicasComponent implements OnInit, OnDestroy {
  showMore = true;
  replicas?: Array<string>;
  unsubscribe$ = new Subject();
  backend = 'eureka';

  constructor(
    private replicasService: ReplicasService,
    private refreshService: RefreshService,
    private eurekaStatusService: EurekaStatusService
  ) {}

  ngOnInit(): void {
    this.refreshService.refreshReload$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.refresh());
    this.refresh();
  }

  refresh(): void {
    this.eurekaStatusService
      .findAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => (this.backend = typeof data.status.backend === 'string' ? data.status.backend : 'eureka'));
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
