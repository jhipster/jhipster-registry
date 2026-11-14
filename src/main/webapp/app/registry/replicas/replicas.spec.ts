import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { RefreshService } from 'app/shared/refresh/refresh.service';

import Replicas from './replicas';
import { ReplicasService } from './replicas.service';

describe('Replicas Component', () => {
  let comp: Replicas;
  let service: ReplicasService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    comp = TestBed.createComponent(Replicas).componentInstance;
    service = TestBed.inject(ReplicasService);
    vi.spyOn(service, 'findAll').mockReturnValue(of(['localhost:8761']));
  });

  it('should load the replicas on init and on refresh', () => {
    comp.ngOnInit();
    expect(comp.replicas()).toEqual(['localhost:8761']);

    vi.spyOn(service, 'findAll').mockReturnValue(of(['eureka-peer-2:8762']));
    TestBed.inject(RefreshService).refreshReload();

    expect(comp.replicas()).toEqual(['eureka-peer-2:8762']);
  });
});
