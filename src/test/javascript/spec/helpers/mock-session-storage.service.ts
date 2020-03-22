import { SpyObject } from './spyobject';
import Spy = jasmine.Spy;
import { SessionStorageService } from 'ngx-webstorage';

export class MockSessionStorageService extends SpyObject {
  getRetrieveSpy?: Spy;
  storeUrlSpy: Spy;

  constructor() {
    super(SessionStorageService);
    this.setSessionSpy('{}');
    this.storeUrlSpy = this.spy('store').andReturn(this);
  }

  setSessionSpy(json: string): void {
    this.getRetrieveSpy = this.spy('retrieve').andReturn(json);
  }
}
