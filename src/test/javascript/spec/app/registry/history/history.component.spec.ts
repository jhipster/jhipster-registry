import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { JHipsterRegistryTestModule } from '../../../test.module';
import { JhiHistoryComponent, JhiHistoryService } from 'app/registry';
import { JhiRefreshService } from 'app/shared';

describe('Component Tests', () => {
    describe('HistoryComponent', () => {
        let comp: JhiHistoryComponent;
        let fixture: ComponentFixture<JhiHistoryComponent>;

        beforeEach(
            async(() => {
                TestBed.configureTestingModule({
                    imports: [JHipsterRegistryTestModule],
                    declarations: [JhiHistoryComponent],
                    providers: [JhiHistoryService, JhiRefreshService]
                })
                    .overrideTemplate(JhiHistoryComponent, '')
                    .compileComponents();
            })
        );

        beforeEach(() => {
            fixture = TestBed.createComponent(JhiHistoryComponent);
            comp = fixture.componentInstance;
            fixture.detectChanges();
        });

        it(
            'refresh data',
            fakeAsync(
                inject([JhiHistoryService], (service: JhiHistoryService) => {
                    const response = {
                        canceled: {
                            '11052017': 'instance1'
                        },
                        registered: {
                            '11022017': 'instance2'
                        }
                    };
                    spyOn(service, 'findAll').and.returnValue(Observable.of(response));

                    comp.refresh();
                    tick();

                    expect(service.findAll).toHaveBeenCalled();
                    expect(comp.data).toEqual(response);
                })
            )
        );

        it(
            'activate registered tab',
            fakeAsync(
                inject([JhiHistoryService], (service: JhiHistoryService) => {
                    const response = {
                        canceled: {
                            '11052017': 'instance1'
                        },
                        registered: {
                            '11022017': 'instance2'
                        }
                    };
                    spyOn(service, 'findAll').and.returnValue(Observable.of(response));

                    comp.ngOnInit();
                    tick();
                    comp.activate('registered');

                    expect(comp.items[0]).toEqual({ key: '11022017', value: 'instance2' });
                })
            )
        );
    });
});
