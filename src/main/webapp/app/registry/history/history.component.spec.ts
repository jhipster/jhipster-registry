import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { RefreshService } from 'app/shared/refresh/refresh.service';
import { HistoryComponent } from 'app/registry/history/history.component';
import { HistoryService } from 'app/registry/history/history.service';

describe('Component Tests', () => {
  describe('HistoryComponent', () => {
    let comp: HistoryComponent;
    let fixture: ComponentFixture<HistoryComponent>;
    let service: HistoryService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot()],
          declarations: [HistoryComponent],
          providers: [HistoryService, RefreshService],
        })
          .overrideTemplate(HistoryComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(HistoryComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(HistoryService);
      fixture.detectChanges();
    });

    it('refresh data', fakeAsync((): void => {
      const response = {
        canceled: {
          '11052017': 'instance1',
        },
        registered: {
          '11022017': 'instance2',
        },
      };
      jest.spyOn(service, 'findAll').mockReturnValue(of(response));

      comp.refresh();
      tick();

      expect(service.findAll).toHaveBeenCalled();
      expect(comp.eurekaHistory).toEqual(response);
    }));

    it('activate registered tab', fakeAsync((): void => {
      const response = {
        canceled: {
          '11052017': 'instance1',
        },
        registered: {
          '11022017': 'instance2',
        },
      };
      jest.spyOn(service, 'findAll').mockReturnValue(of(response));

      comp.ngOnInit();
      tick();
      comp.activate('registered');

      expect(comp.histories![11022017]).toEqual('instance2');
    }));
  });
});
