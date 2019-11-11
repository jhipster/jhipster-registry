import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiDataUtils, JhiDateUtils, JhiEventManager, JhiAlertService, JhiParseLinks } from 'ng-jhipster';

import { AccountService } from 'app/core/auth/account.service';
import { LoginModalService } from 'app/core/login/login-modal.service';
import { MockAccountService } from './helpers/mock-account.service';
import { MockActivatedRoute, MockRouter } from './helpers/mock-route.service';
import { MockActiveModal } from './helpers/mock-active-modal.service';
import { MockEventManager } from './helpers/mock-event-manager.service';
import { SessionStorageService } from 'ngx-webstorage';
import { MockSessionStorageService } from './helpers/mock-session-storage.service';

@NgModule({
  providers: [
    DatePipe,
    JhiDataUtils,
    JhiDateUtils,
    JhiParseLinks,
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
      useValue: new MockActivatedRoute({ id: 123 })
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
      provide: JhiAlertService,
      useValue: null
    },
    {
      provide: NgbModal,
      useValue: null
    },
    {
      provide: SessionStorageService,
      useValue: MockSessionStorageService
    }
  ],
  imports: [HttpClientTestingModule]
})
export class JHipsterRegistryTestModule {}
