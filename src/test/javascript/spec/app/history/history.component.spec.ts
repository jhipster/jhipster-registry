import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { JhiHistoryComponent, JhiHistoryService } from '../../../../../main/webapp/app/history';


describe('Component Tests', () => {

    describe('HistoryComponent', () => {

        let comp: JhiHistoryComponent;
        let fixture: ComponentFixture<JhiHistoryComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [JhiHistoryComponent],
                providers: [
                    MockBackend,
                    BaseRequestOptions,
                    {
                        provide: Http,
                        useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backendInstance, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    },
                    JhiHistoryService
                ]
            })
                .overrideComponent(JhiHistoryComponent, {
                    set: {
                        template: ''
                    }
                })
                .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(JhiHistoryComponent);
            comp = fixture.componentInstance;
        });

        it('refresh data',
            fakeAsync(
                inject([JhiHistoryService], (service: JhiHistoryService) => {
                    let response = {
                        'canceled': {
                            '11052017': 'instance1'
                        },
                        'registered': {
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

        it('activate registered tab',
            fakeAsync(
                inject([JhiHistoryService], (service: JhiHistoryService) => {
                    let response = {
                        'canceled': {
                            '11052017': 'instance1'
                        },
                        'registered': {
                            '11022017': 'instance2'
                        }
                    };
                    spyOn(service, 'findAll').and.returnValue(Observable.of(response));

                    comp.ngOnInit();
                    tick();
                    comp.activate('registered');

                    expect(comp.items[0]).toEqual({key: '11022017', value: 'instance2'});
                })
            )
        );
    });
});
