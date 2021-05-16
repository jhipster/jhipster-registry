import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable({ providedIn: 'root' })
export class StateStorageService {
  private previousUrlKey = 'previousUrl';

  constructor(private sessionStorageService: SessionStorageService) {}

  storeUrl(url: string): void {
    this.sessionStorageService.store(this.previousUrlKey, url);
  }

  getUrl(): string | null {
    return this.sessionStorageService.retrieve(this.previousUrlKey) as string | null;
  }

  clearUrl(): void {
    this.sessionStorageService.clear(this.previousUrlKey);
  }

  storeDestinationState(destinationState: any, destinationStateParams: any, fromState: any): void {
    const destinationInfo = {
      destination: {
        name: destinationState.name,
        data: destinationState.data,
      },
      params: destinationStateParams,
      from: {
        name: fromState.name,
      },
    };
    this.sessionStorageService.store('destinationState', destinationInfo);
  }
}
