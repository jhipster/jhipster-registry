import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap/nav';

import { RefreshService } from 'app/shared/refresh/refresh.service';

import History from './history';
import { HistoryService } from './history.service';

describe('History Component', () => {
  let comp: History;
  let service: HistoryService;
  const history = { registered: { 1: 'APP(app:1)' }, canceled: { 2: 'APP(app:2)' } };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    comp = TestBed.createComponent(History).componentInstance;
    service = TestBed.inject(HistoryService);
    vi.spyOn(service, 'findAll').mockReturnValue(of(history));
  });

  it('should show the registered leases first', () => {
    comp.ngOnInit();

    expect(comp.histories()).toEqual(history.registered);
  });

  it('should show the cancelled leases when that tab is chosen, and keep the tab after a refresh', () => {
    comp.ngOnInit();

    comp.navChange({ nextId: 'canceled' } as NgbNavChangeEvent);
    TestBed.inject(RefreshService).refreshReload();

    expect(service.findAll).toHaveBeenCalledTimes(2);
    expect(comp.histories()).toEqual(history.canceled);
  });
});
