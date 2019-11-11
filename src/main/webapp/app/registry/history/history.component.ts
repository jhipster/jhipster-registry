import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { JhiHistoryService } from './history.service';
import { JhiRefreshService } from 'app/shared/refresh/refresh.service';

@Component({
  selector: 'jhi-history',
  templateUrl: './history.component.html'
})
export class JhiHistoryComponent implements OnInit, OnDestroy {
  items: any;
  data: any;
  activeKey: any;

  unSubscribe$ = new Subject();

  constructor(private historyService: JhiHistoryService, private refreshService: JhiRefreshService) {}

  ngOnInit() {
    this.refreshService.refreshReload$.pipe(takeUntil(this.unSubscribe$)).subscribe(() => this.refresh());
    this.refresh();
  }

  ngOnDestroy() {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  refresh() {
    this.historyService
      .findAll()
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe(data => {
        this.data = data;
        if (this.activeKey) {
          this.activate(this.activeKey);
        } else {
          this.activate('registered');
        }
      });
  }

  activate(key: string) {
    this.activeKey = key;
    this.items = [];
    const obj = this.data ? this.data[key] : null;
    if (obj) {
      for (const k of Object.keys(obj)) {
        this.items.push({ key: k, value: obj[k] });
      }
    }
    this.items = this.sortItems(this.items);
  }

  beforeChange($event: NgbTabChangeEvent) {
    this.activate($event.nextId);
  }

  private sortItems(items: any[]) {
    this.items = items.sort((a, b) => {
      if (a.key < b.key) {
        return 1;
      } else if (b.key < a.key) {
        return -1;
      } else {
        return 0;
      }
    });
    return items;
  }
}
