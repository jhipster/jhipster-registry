import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementRef, NgModule, Renderer } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiDataUtils, JhiDateUtils, JhiEventManager, JhiParseLinks } from 'ng-jhipster';

import { MockAccountService } from './helpers/mock-account.service';
import { MockActivatedRoute, MockRouter } from './helpers/mock-route.service';
import { MockActiveModal } from './helpers/mock-active-modal.service';
import { MockEventManager } from './helpers/mock-event-manager.service';
import { AccountService, LoginModalService } from 'app/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { JhiRoutesService } from 'app/shared';

@NgModule({
  providers: [
    DatePipe,
    JhiDataUtils,
    JhiDateUtils,
    JhiParseLinks,
    JhiRoutesService,
    {
      provide: JhiEventManager,
      useClass: MockEventManager
    },
    {
      provide: NgbActiveModal,
      useClass: MockActiveModal
    },
    {
      provide: ActivatedRoute,
      useValue: new MockActivatedRoute({id: 123})
    },
    {
      provide: Router,
      useClass: MockRouter
    },
    {
      provide: AccountService,
      useClass: MockAccountService
    },
    {
      provide: LoginModalService,
      useValue: null
    },
    {
      provide: ElementRef,
      useValue: null
    },
    {
      provide: Renderer,
      useValue: null
    },
    {
      provide: JhiAlertService,
      useValue: null
    },
    {
      provide: NgbModal,
      useValue: null
    }
  ],
  imports: [
    HttpClientTestingModule,
    NgxWebstorageModule.forRoot({prefix: 'jhi', separator: '-'})
  ]
})
export class JHipsterRegistryTestModule {
}
