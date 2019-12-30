import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { JHipsterRegistryTestModule } from '../../../test.module';
import { RefreshService } from 'app/shared/refresh/refresh.service';
import { HistoryComponent } from 'app/registry/history/history.component';
import { HistoryService } from 'app/registry/history/history.service';

describe('Component Tests', () => {
  describe('HistoryComponent', () => {
    let comp: HistoryComponent;
    let fixture: ComponentFixture<HistoryComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [HistoryComponent],
        providers: [HistoryService, RefreshService]
      })
        .overrideTemplate(HistoryComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HistoryComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('refresh data', fakeAsync(
      inject([HistoryService], (service: HistoryService) => {
        const response = {
          canceled: {
            '11052017': 'instance1'
          },
          registered: {
            '11022017': 'instance2'
          }
        };
        spyOn(service, 'findAll').and.returnValue(of(response));

        comp.refresh();
        tick();

        expect(service.findAll).toHaveBeenCalled();
        expect(comp.eurekaHistory).toEqual(response);
      })
    ));

    it('activate registered tab', fakeAsync(
      inject([HistoryService], (service: HistoryService) => {
        const response = {
          canceled: {
            '11052017': 'instance1'
          },
          registered: {
            '11022017': 'instance2'
          }
        };
        spyOn(service, 'findAll').and.returnValue(of(response));

        comp.ngOnInit();
        tick();
        comp.activate('registered');

        expect(comp.histories![11022017]).toEqual('instance2');
      })
    ));
  });
});
