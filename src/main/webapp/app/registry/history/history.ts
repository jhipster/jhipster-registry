import { DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbNav, NgbNavChangeEvent, NgbNavContent, NgbNavItem, NgbNavLink } from '@ng-bootstrap/ng-bootstrap/nav';

import { KeysPipe } from 'app/shared/array/keys.pipe';
import { OrderByPipe } from 'app/shared/array/order-by.pipe';
import RefreshSelector from 'app/shared/refresh/refresh-selector';
import { RefreshService } from 'app/shared/refresh/refresh.service';

import { EurekaHistory, EurekaHistoryType, HistoryService } from './history.service';

@Component({
  selector: 'jhi-history',
  templateUrl: './history.html',
  imports: [DatePipe, KeysPipe, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, OrderByPipe, RefreshSelector],
})
export default class History implements OnInit {
  readonly eurekaHistory = signal<EurekaHistory | undefined>(undefined);
  readonly activeKey = signal<EurekaHistoryType>('registered');
  readonly histories = computed(() => this.eurekaHistory()?.[this.activeKey()]);

  private readonly destroyRef = inject(DestroyRef);
  private readonly historyService = inject(HistoryService);
  private readonly refreshService = inject(RefreshService);

  ngOnInit(): void {
    this.refreshService.refreshReload$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.refresh());
    this.refresh();
  }

  refresh(): void {
    this.historyService
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(history => this.eurekaHistory.set(history));
  }

  navChange(event: NgbNavChangeEvent): void {
    this.activeKey.set(event.nextId as EurekaHistoryType);
  }
}
