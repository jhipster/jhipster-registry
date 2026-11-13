import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';

import RefreshSelector from 'app/shared/refresh/refresh-selector';
import { RefreshService } from 'app/shared/refresh/refresh.service';

import { ReplicasService } from './replicas.service';

@Component({
  selector: 'jhi-replicas',
  templateUrl: './replicas.html',
  styleUrl: './replicas.scss',
  imports: [FontAwesomeModule, NgbCollapse, RefreshSelector],
})
export default class Replicas implements OnInit {
  readonly showMore = signal(true);
  readonly replicas = signal<string[]>([]);

  private readonly destroyRef = inject(DestroyRef);
  private readonly replicasService = inject(ReplicasService);
  private readonly refreshService = inject(RefreshService);

  ngOnInit(): void {
    this.refreshService.refreshReload$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.refresh());
    this.refresh();
  }

  refresh(): void {
    this.replicasService
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(replicas => this.replicas.set(replicas));
  }
}
