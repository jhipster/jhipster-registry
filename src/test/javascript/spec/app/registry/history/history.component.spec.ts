import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { JHipsterRegistryTestModule } from '../../../test.module';
import { JhiRefreshService } from 'app/shared/refresh/refresh.service';
import { JhiHistoryComponent } from 'app/registry/history/history.component';
import { JhiHistoryService } from 'app/registry/history/history.service';

describe('Component Tests', () => {
  describe('HistoryComponent', () => {
    let comp: JhiHistoryComponent;
    let fixture: ComponentFixture<JhiHistoryComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [JHipsterRegistryTestModule],
        declarations: [JhiHistoryComponent],
        providers: [JhiHistoryService, JhiRefreshService]
      })
        .overrideTemplate(JhiHistoryComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(JhiHistoryComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('refresh data', fakeAsync(
      inject([JhiHistoryService], (service: JhiHistoryService) => {
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
        expect(comp.data).toEqual(response);
      })
    ));

    it('activate registered tab', fakeAsync(
      inject([JhiHistoryService], (service: JhiHistoryService) => {
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

        expect(comp.items[0]).toEqual({ key: '11022017', value: 'instance2' });
      })
    ));
  });
});
