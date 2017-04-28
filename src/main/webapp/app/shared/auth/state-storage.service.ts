import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ng2-webstorage';

@Injectable()
export class StateStorageService {
    constructor(
        private $sessionStorage: SessionStorageService
    ) {}

    getPreviousState() {
        return this.$sessionStorage.retrieve('previousState');
    }

    resetPreviousState() {
        this.$sessionStorage.clear('previousState');
    }

    storePreviousState(previousStateName, previousStateParams) {
        const previousState = { 'name': previousStateName, 'params': previousStateParams };
        this.$sessionStorage.store('previousState', previousState);
    }

    getDestinationState() {
        return this.$sessionStorage.retrieve('destinationState');
    }

    storeUrl(url: string) {
        this.$sessionStorage.store('previousUrl', url);
    }

    getUrl() {
        return this.$sessionStorage.retrieve('previousUrl');
    }

    storeDestinationState(destinationState, destinationStateParams, fromState) {
        const destinationInfo = {
            'destination': {
                'name': destinationState.name,
                'data': destinationState.data,
            },
            'params': destinationStateParams,
            'from': {
                'name': fromState.name,
            }
        };
        this.$sessionStorage.store('destinationState', destinationInfo);
    }

    getSelectedInstance() {
        return this.$sessionStorage.retrieve('instanceId');
    }

    storeSelectedInstance(instance) {
        this.$sessionStorage.store('instanceId', instance);
    }

    getSelectedRefreshTime(): number {
        return this.$sessionStorage.retrieve('refreshTime');
    }

    storeSelectedRefreshTime(time: number) {
        this.$sessionStorage.store('refreshTime', time);
    }
}
